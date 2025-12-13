"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductList from "./components/ProductList";
import OrderList from "./components/OrderList";
import SupplierKeysManager from "./components/SupplierKeysManager";
import VisibilityRulesManager from "./components/VisibilityRulesManager";
import { Package, ShoppingCart, Plug, Eye } from "lucide-react";

export default function NettbutikkPageClient() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Nettbutikk</h1>
        <p className="text-muted-foreground">
          Administrer produkter, ordrer og leverandørintegrasjoner for nettbutikken din
        </p>
      </div>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="products" className="gap-2">
            <Package className="h-4 w-4" />
            Produkter
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Ordrer
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="gap-2">
            <Plug className="h-4 w-4" />
            Leverandører
          </TabsTrigger>
          <TabsTrigger value="visibility" className="gap-2">
            <Eye className="h-4 w-4" />
            Synlighet
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Produkthåndtering</CardTitle>
              <CardDescription>
                Administrer egne produkter fra eget lager
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductList />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ordrehåndtering</CardTitle>
              <CardDescription>
                Se og administrer kundeordrer og bestillinger
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrderList />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leverandørintegrasjoner</CardTitle>
              <CardDescription>
                Konfigurer API-tilgang og synkroniser produkter fra leverandører
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupplierKeysManager />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visibility Tab */}
        <TabsContent value="visibility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Synlighetsregler</CardTitle>
              <CardDescription>
                Kontroller hvilke produkter som er synlige for ulike kundegrupper
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VisibilityRulesManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
