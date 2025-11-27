"use client";

import { useEffect, useState, FormEvent } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
const ORG_ID =
  process.env.NEXT_PUBLIC_ORG_ID ?? "ae407558-7f44-40cb-8fe9-1d023212b926";

type ServiceCategory = {
  id: string;
  orgId: string;
  name: string;
  position: number;
  createdAt: string;
  updatedAt: string;
};

type Service = {
  id: string;
  orgId: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  durationMinutes: number | null;
  price: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type Employee = {
  id: string;
  orgId: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// Rå rad fra employee_services (kommer rett fra Supabase, snake_case)
type EmployeeServiceRow = {
  id: string;
  org_id: string;
  employee_id: string;
  service_id: string;
  created_at: string;
  updated_at: string;
};

type EmployeeFormState = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
};

type EmployeePayload = {
  name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  isActive: boolean;
};

export default function EmployeesPageClient() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [employeeServices, setEmployeeServices] = useState<EmployeeServiceRow[]>(
    [],
  );

  const [employeeForm, setEmployeeForm] = useState<EmployeeFormState>({
    name: "",
    email: "",
    phone: "",
    role: "",
    isActive: true,
  });

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null,
  );

  const isEditingEmployee = Boolean(employeeForm.id);

  useEffect(() => {
    void loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setError(null);

    try {
      const [empRes, servRes, catRes, empServRes] = await Promise.all([
        fetch(
          `${API_BASE_URL}/api/orgs/${encodeURIComponent(ORG_ID)}/employees`,
        ),
        fetch(
          `${API_BASE_URL}/api/orgs/${encodeURIComponent(ORG_ID)}/services`,
        ),
        fetch(
          `${API_BASE_URL}/api/orgs/${encodeURIComponent(
            ORG_ID,
          )}/service-categories`,
        ),
        fetch(
          `${API_BASE_URL}/api/orgs/${encodeURIComponent(
            ORG_ID,
          )}/employee-services`,
        ),
      ]);

      if (!empRes.ok) {
        const txt = await empRes.text().catch(() => "");
        throw new Error(
          `Feil ved henting av ansatte (${empRes.status}): ${txt}`,
        );
      }
      if (!servRes.ok) {
        const txt = await servRes.text().catch(() => "");
        throw new Error(
          `Feil ved henting av tjenester (${servRes.status}): ${txt}`,
        );
      }
      if (!catRes.ok) {
        const txt = await catRes.text().catch(() => "");
        throw new Error(
          `Feil ved henting av service-kategorier (${catRes.status}): ${txt}`,
        );
      }
      if (!empServRes.ok) {
        const txt = await empServRes.text().catch(() => "");
        throw new Error(
          `Feil ved henting av employee_services (${empServRes.status}): ${txt}`,
        );
      }

      const empJson = (await empRes.json()) as { employees?: Employee[] };
      const servJson = (await servRes.json()) as { services?: Service[] };
      const catJson = (await catRes.json()) as {
        categories?: ServiceCategory[];
      };
      const empServJson = (await empServRes.json()) as {
        employeeServices?: EmployeeServiceRow[];
      };

      setEmployees(empJson.employees ?? []);
      setServices(servJson.services ?? []);
      setCategories(catJson.categories ?? []);
      setEmployeeServices(empServJson.employeeServices ?? []);
    } catch (err: unknown) {
      console.error("loadAll (ansatte) error:", err);
      const errorMessage = err instanceof Error ? err.message : "Uventet feil ved henting av ansatte / tjenester";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // ---------- ANSATTE CRUD ----------

  function resetEmployeeForm() {
    setEmployeeForm({
      id: undefined,
      name: "",
      email: "",
      phone: "",
      role: "",
      isActive: true,
    });
  }

  function handleEditEmployee(employee: Employee) {
    setEmployeeForm({
      id: employee.id,
      name: employee.name ?? "",
      email: employee.email ?? "",
      phone: employee.phone ?? "",
      role: employee.role ?? "",
      isActive: employee.isActive ?? true,
    });
    setSelectedEmployeeId(employee.id);
  }

  async function handleSubmitEmployee(e: FormEvent) {
    e.preventDefault();
    if (!employeeForm.name.trim()) return;

    setSaving(true);
    setError(null);

    const isEdit = Boolean(employeeForm.id);
    const url = isEdit
      ? `${API_BASE_URL}/api/orgs/${encodeURIComponent(
          ORG_ID,
        )}/employees/${encodeURIComponent(employeeForm.id!)}`
      : `${API_BASE_URL}/api/orgs/${encodeURIComponent(ORG_ID)}/employees`;

    const payload: EmployeePayload = {
      name: employeeForm.name.trim(),
      email: employeeForm.email.trim() || null,
      phone: employeeForm.phone.trim() || null,
      role: employeeForm.role.trim() || null,
      isActive: employeeForm.isActive,
    };

    try {
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(
          `Feil ved lagring av ansatt (${res.status}): ${txt}`,
        );
      }

      if (!isEdit) {
        // Velg den nye ansatte etter reload
        // (enkelt: reload og la brukeren velge – vi kunne også lese responsen, men dette holder)
      }

      resetEmployeeForm();
      await loadAll();
    } catch (err: any) {
      console.error("handleSubmitEmployee error:", err);
      setError(err?.message ?? "Uventet feil ved lagring av ansatt");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteEmployee(id: string) {
    const confirmation = window.confirm(
      "Er du sikker på at du vil slette denne ansatte? Tilknyttede employee_services vil også miste mening.",
    );
    if (!confirmation) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/orgs/${encodeURIComponent(
          ORG_ID,
        )}/employees/${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );

      if (!res.ok && res.status !== 204) {
        const txt = await res.text().catch(() => "");
        throw new Error(
          `Feil ved sletting av ansatt (${res.status}): ${txt}`,
        );
      }

      if (selectedEmployeeId === id) {
        setSelectedEmployeeId(null);
      }
      if (employeeForm.id === id) {
        resetEmployeeForm();
      }

      await loadAll();
    } catch (err: any) {
      console.error("handleDeleteEmployee error:", err);
      setError(err?.message ?? "Uventet feil ved sletting av ansatt");
    } finally {
      setSaving(false);
    }
  }

  // ---------- TJENESTER PER ANSATT ----------

  const selectedEmployee =
    selectedEmployeeId != null
      ? employees.find((e) => e.id === selectedEmployeeId) ?? null
      : null;

  // Hvilke service_id er tilknyttet valgt ansatt?
  const selectedEmployeeServiceIds = new Set(
    employeeServices
      .filter((es) => es.employee_id === selectedEmployeeId)
      .map((es) => es.service_id),
  );

  async function toggleServiceForEmployee(serviceId: string, checked: boolean) {
    if (!selectedEmployeeId) return;

    setSaving(true);
    setError(null);

    try {
      if (checked) {
        // Opprett ny kobling hvis den ikke finnes
        const exists = employeeServices.some(
          (es) =>
            es.employee_id === selectedEmployeeId &&
            es.service_id === serviceId,
        );
        if (!exists) {
          const res = await fetch(
            `${API_BASE_URL}/api/orgs/${encodeURIComponent(
              ORG_ID,
            )}/employee-services`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                employee_id: selectedEmployeeId,
                service_id: serviceId,
              }),
            },
          );

          if (!res.ok) {
            const txt = await res.text().catch(() => "");
            throw new Error(
              `Feil ved kobling ansatt/tjeneste (${res.status}): ${txt}`,
            );
          }
        }
      } else {
        // Fjern eksisterende kobling
        const existing = employeeServices.find(
          (es) =>
            es.employee_id === selectedEmployeeId &&
            es.service_id === serviceId,
        );
        if (existing) {
          const res = await fetch(
            `${API_BASE_URL}/api/orgs/${encodeURIComponent(
              ORG_ID,
            )}/employee-services/${encodeURIComponent(existing.id)}`,
            { method: "DELETE" },
          );

          if (!res.ok && res.status !== 204) {
            const txt = await res.text().catch(() => "");
            throw new Error(
              `Feil ved fjerning av kobling (${res.status}): ${txt}`,
            );
          }
        }
      }

      // Reload koblinger
      const empServRes = await fetch(
        `${API_BASE_URL}/api/orgs/${encodeURIComponent(
          ORG_ID,
        )}/employee-services`,
      );
      if (!empServRes.ok) {
        const txt = await empServRes.text().catch(() => "");
        throw new Error(
          `Feil ved oppdatering av employee_services (${empServRes.status}): ${txt}`,
        );
      }
      const empServJson = (await empServRes.json()) as {
        employeeServices?: EmployeeServiceRow[];
      };
      setEmployeeServices(empServJson.employeeServices ?? []);
    } catch (err: any) {
      console.error("toggleServiceForEmployee error:", err);
      setError(
        err?.message ??
          "Uventet feil ved oppdatering av hvilke tjenester ansatt kan utføre",
      );
    } finally {
      setSaving(false);
    }
  }

  // Sorter tjenester etter kategori + navn (for litt orden i UI)
  const servicesWithCategory = services
    .slice()
    .sort((a, b) => {
      const catA =
        a.categoryId &&
        categories.find((c) => c.id === a.categoryId)?.name?.toLowerCase();
      const catB =
        b.categoryId &&
        categories.find((c) => c.id === b.categoryId)?.name?.toLowerCase();

      if ((catA || "") < (catB || "")) return -1;
      if ((catA || "") > (catB || "")) return 1;

      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

  // ---------- RENDER ----------

  if (loading) {
    return (
      <div className="h-full w-full overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-slate-500">Laster ansatte …</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Ansatte
            </h1>
            <p className="text-sm text-slate-500">
              Legg inn ansatte, og bestem hvilke tjenester hver enkelt kan
              utføre i LYXso.
            </p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
            <p className="font-medium text-slate-700">
              Org-ID: <span className="font-mono">{ORG_ID}</span>
            </p>
            {saving && (
              <p className="mt-1 text-[11px] text-blue-600">
                Lagrer endringer…
              </p>
            )}
          </div>
        </header>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {/* ANSATTE */}
          <section className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Ansattliste
                  </h2>
                  <p className="text-xs text-slate-500">
                    Brukes i booking, tildeling av jobber og oversikt i
                    dashboard.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmitEmployee}
                className="space-y-3 rounded-lg bg-slate-50 p-3"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Navn
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={employeeForm.name}
                      onChange={(e) =>
                        setEmployeeForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="F.eks. Ola Detailing"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      E-post
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={employeeForm.email}
                      onChange={(e) =>
                        setEmployeeForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="ola@firma.no"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={employeeForm.phone}
                      onChange={(e) =>
                        setEmployeeForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="F.eks. 900 00 000"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Rolle / stilling
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={employeeForm.role}
                      onChange={(e) =>
                        setEmployeeForm((prev) => ({
                          ...prev,
                          role: e.target.value,
                        }))
                      }
                      placeholder="F.eks. Detailer, Lakk, Dekkhotell"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center gap-2">
                    <input
                      id="employee-active"
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={employeeForm.isActive}
                      onChange={(e) =>
                        setEmployeeForm((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                    />
                    <label
                      htmlFor="employee-active"
                      className="text-xs text-slate-600"
                    >
                      Ansatt er aktiv (vises i booking og tildeling)
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
                    disabled={saving || !employeeForm.name.trim()}
                  >
                    {isEditingEmployee ? "Oppdater ansatt" : "Legg til ansatt"}
                  </button>
                  {isEditingEmployee && (
                    <button
                      type="button"
                      className="text-xs text-slate-500 hover:text-slate-700"
                      onClick={resetEmployeeForm}
                    >
                      Avbryt redigering
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
                {employees.length === 0 ? (
                  <div className="px-3 py-4 text-xs text-slate-500">
                    Ingen ansatte registrert enda. Legg til den første i skjemaet
                    over.
                  </div>
                ) : (
                  <table className="min-w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-3 py-2">Navn</th>
                        <th className="px-3 py-2">Rolle</th>
                        <th className="px-3 py-2">E-post</th>
                        <th className="px-3 py-2">Telefon</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((emp) => (
                        <tr
                          key={emp.id}
                          className={[
                            "border-b border-slate-100 last:border-0 hover:bg-slate-50/70 cursor-pointer",
                            selectedEmployeeId === emp.id ? "bg-slate-50" : "",
                          ].join(" ")}
                          onClick={() => setSelectedEmployeeId(emp.id)}
                        >
                          <td className="px-3 py-2 text-slate-800">
                            {emp.name || "Uten navn"}
                          </td>
                          <td className="px-3 py-2 text-slate-500">
                            {emp.role ?? "–"}
                          </td>
                          <td className="px-3 py-2 text-slate-500">
                            {emp.email ?? "–"}
                          </td>
                          <td className="px-3 py-2 text-slate-500">
                            {emp.phone ?? "–"}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={[
                                "inline-flex items-center rounded-full px-2 py-0.5 text-[11px]",
                                emp.isActive
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  : "bg-slate-100 text-slate-500 border border-slate-200",
                              ].join(" ")}
                            >
                              {emp.isActive ? "Aktiv" : "Inaktiv"}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button
                              type="button"
                              className="mr-2 text-[11px] font-medium text-blue-600 hover:text-blue-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditEmployee(emp);
                              }}
                            >
                              Rediger
                            </button>
                            <button
                              type="button"
                              className="text-[11px] font-medium text-red-500 hover:text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                void handleDeleteEmployee(emp.id);
                              }}
                            >
                              Slett
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </section>

          {/* TJENESTER PER ANSATT */}
          <section className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3">
                <h2 className="text-sm font-semibold text-slate-900">
                  Hvilke tjenester kan hver ansatt utføre?
                </h2>
                <p className="text-xs text-slate-500">
                  Brukes senere i bookingmotoren for å vite hvem som kan ta hvilke
                  jobber.
                </p>
              </div>

              {!selectedEmployee ? (
                <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-xs text-slate-500">
                  Velg en ansatt i listen til venstre for å tilpasse hvilke
                  tjenester vedkommende kan utføre.
                </div>
              ) : services.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-xs text-slate-500">
                  Ingen tjenester registrert enda. Gå til{" "}
                  <span className="font-medium">Tjenester</span>-siden og legg inn
                  tjenester først.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    <p className="font-medium text-slate-800">
                      {selectedEmployee.name}
                    </p>
                    <p>
                      Huk av hvilke tjenester {selectedEmployee.name} kan utføre.
                    </p>
                  </div>

                  <div className="max-h-[420px] space-y-2 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 p-3">
                    {servicesWithCategory.map((service) => {
                      const cat =
                        service.categoryId &&
                        categories.find((c) => c.id === service.categoryId);
                      const checked = selectedEmployeeServiceIds.has(
                        service.id,
                      );

                      return (
                        <label
                          key={service.id}
                          className="flex items-start gap-2 rounded-md bg-white px-3 py-2 text-xs shadow-sm"
                        >
                          <input
                            type="checkbox"
                            className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            checked={checked}
                            onChange={(e) =>
                              void toggleServiceForEmployee(
                                service.id,
                                e.target.checked,
                              )
                            }
                          />
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-1">
                              <span className="font-medium text-slate-900">
                                {service.name}
                              </span>
                              {cat && (
                                <span className="rounded-full bg-slate-100 px-2 py-[1px] text-[10px] font-medium uppercase tracking-wide text-slate-500">
                                  {cat.name}
                                </span>
                              )}
                              {!service.isActive && (
                                <span className="rounded-full bg-slate-100 px-2 py-[1px] text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                  Inaktiv tjeneste
                                </span>
                              )}
                            </div>
                            {service.durationMinutes != null ||
                            service.price != null ? (
                              <p className="mt-1 text-[11px] text-slate-500">
                                {service.durationMinutes != null && (
                                  <span>{service.durationMinutes} min</span>
                                )}
                                {service.durationMinutes != null &&
                                  service.price != null && (
                                    <span className="mx-1">•</span>
                                  )}
                                {service.price != null && (
                                  <span>
                                    {service.price.toLocaleString("nb-NO")} kr
                                  </span>
                                )}
                              </p>
                            ) : null}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
