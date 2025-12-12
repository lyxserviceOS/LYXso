const { Octokit } = require("@octokit/rest");

const STALE_DAYS = process.env.STALE_DAYS ? parseInt(process.env.STALE_DAYS, 10) : 14;
const PATTERNS = [/^copilot\//, /^revert-/, /^vercel\//, /^fix\//];

async function run() {
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPOSITORY;

  if (!token || !repoFull) {
    console.error("GITHUB_TOKEN and GITHUB_REPOSITORY must be set");
    process.exit(1);
  }

  const [owner, repo] = repoFull.split("/");
  const octokit = new Octokit({ auth: token });

  // get default branch
  const { data: repoInfo } = await octokit.repos.get({ owner, repo });
  const defaultBranch = repoInfo.default_branch;

  console.log(`Repository: ${owner}/${repo}, default branch: ${defaultBranch}`);

  // list branches (paginated)
  const branches = [];
  for await (const resp of octokit.paginate.iterator(octokit.repos.listBranches, { owner, repo, per_page: 100 })) {
    branches.push(...resp.data);
  }

  const now = new Date();

  for (const b of branches) {
    const name = b.name;
    if (name === defaultBranch) continue;
    if (!PATTERNS.some((re) => re.test(name))) continue;

    let protectedBranch = false;
    try {
      await octokit.repos.getBranchProtection({ owner, repo, branch: name });
      protectedBranch = true;
    } catch (err) {
      if (err.status && err.status !== 404) {
        console.warn(`Error checking protection for ${name}: ${err}`);
        continue;
      }
    }
    if (protectedBranch) {
      console.log(`Skipping protected branch ${name}`);
      continue;
    }

    let commitDate;
    try {
      const commitSha = b.commit.sha;
      const { data: commitData } = await octokit.repos.getCommit({ owner, repo, ref: commitSha });
      commitDate = new Date(commitData.commit.committer.date);
    } catch (err) {
      console.warn(`Could not fetch commit for ${name}: ${err}`);
      continue;
    }

    const prs = await octokit.pulls.list({
      owner,
      repo,
      head: `${owner}:${name}`,
      state: "open",
      per_page: 10,
    });
    if (prs.data && prs.data.length > 0) {
      console.log(`Branch ${name} has ${prs.data.length} open PR(s); skipping.`);
      continue;
    }

    const mergedPRs = await octokit.search.issuesAndPullRequests({
      q: `repo:${owner}/${repo} is:pr is:merged head:${name}`,
      per_page: 1,
    });
    const isMerged = mergedPRs.data.total_count > 0;

    const ageDays = Math.round((now - commitDate) / (1000 * 60 * 60 * 24));
    console.log(`Branch ${name}: last commit ${commitDate.toISOString()} (${ageDays} days old), merged: ${isMerged}`);

    if (isMerged || ageDays >= STALE_DAYS) {
      try {
        await octokit.repos.getBranch({ owner, repo, branch: name });
      } catch (err) {
        console.log(`Branch ${name} not found when verifying; skip.`);
        continue;
      }
      try {
        await octokit.git.deleteRef({ owner, repo, ref: `heads/${name}` });
        console.log(`Deleted branch: ${name}`);
      } catch (err) {
        console.warn(`Failed to delete branch ${name}: ${err}`);
      }
    } else {
      console.log(`Branch ${name} is not merged and not stale (age ${ageDays}d); skipping.`);
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
