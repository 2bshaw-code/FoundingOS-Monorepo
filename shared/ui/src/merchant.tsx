/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { type FormEvent, useEffect, useState } from "react";
import { BarChart, Card, InsightPanel, Table } from "./index";
import { ClientDateTime } from "./client-date";

export interface MerchantClient {
  request<T>(path: string, init?: RequestInit): Promise<T>;
}
type Inventory = {
  id: string;
  name: string;
  sku: string;
  category: string;
  pricePence: number;
  stock: number;
  availability: string;
  active: boolean;
  approvalStatus: string;
};
type Order = {
  id: string;
  reference: string;
  status: string;
  totalPence: number;
  paymentStatus: string;
  deliveryStatus: string;
};
type Change = {
  id: string;
  itemId?: string;
  action: string;
  proposed: Record<string, unknown>;
  status: string;
  submittedBy: string;
  createdAt: string;
  reviewNote?: string;
};
type Permission =
  | "uploadStock"
  | "updatePrices"
  | "manageAvailability"
  | "manageCategories"
  | "viewOrders";
type Workspace = {
  inventory: Inventory[];
  orders: Order[];
  changes: Change[];
  permissions: Record<Permission, boolean>;
};
type Staff = {
  id: string;
  email: string;
  role: string;
  active: boolean;
  permissions: Record<Permission, boolean>;
};
type Activity = {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  userId: string;
  createdAt: string;
  details?: unknown;
};
type OwnerData = {
  staff: Staff[];
  changes: Change[];
  activity: Activity[];
  inventory: Inventory[];
  orders: Order[];
  metrics: {
    staff: number;
    activeStaff: number;
    pendingChanges: number;
    approvedChanges: number;
    inventoryItems: number;
    orders: number;
    revenuePence: number;
  };
};
const permissions: Permission[] = [
  "uploadStock",
  "updatePrices",
  "manageAvailability",
  "manageCategories",
  "viewOrders",
];
const labels: Record<Permission, string> = {
  uploadStock: "Upload stock",
  updatePrices: "Update prices",
  manageAvailability: "Manage availability",
  manageCategories: "Manage categories",
  viewOrders: "View orders",
};
const empty: Workspace = {
  inventory: [],
  orders: [],
  changes: [],
  permissions: {
    uploadStock: false,
    updatePrices: false,
    manageAvailability: false,
    manageCategories: false,
    viewOrders: false,
  },
};
const money = (pence = 0) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
    pence / 100,
  );

export function MerchantOperationsConsole({
  client,
  title = "Staff Console",
}: {
  client: MerchantClient;
  title?: string;
}) {
  const [data, setData] = useState(empty);
  const [message, setMessage] = useState("");
  const load = async () => {
    try {
      setData(
        (
          await client.request<{ success: true; data: Workspace }>(
            "/merchant/workspace",
          )
        ).data,
      );
      setMessage("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Workspace unavailable",
      );
    }
  };
  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 15_000);
    return () => window.clearInterval(timer);
  }, [client]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget,
      value = new FormData(form);
    try {
      await client.request("/merchant/changes", {
        method: "POST",
        body: JSON.stringify({
          action: "create",
          proposed: {
            name: value.get("name"),
            sku: value.get("sku"),
            category: value.get("category"),
            pricePence: Number(value.get("pricePence")),
            stock: Number(value.get("stock")),
            availability: value.get("availability"),
          },
        }),
      });
      form.reset();
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to submit stock",
      );
    }
  };
  const change = async (item: Inventory, proposed: Record<string, unknown>) => {
    try {
      await client.request("/merchant/changes", {
        method: "POST",
        body: JSON.stringify({ action: "update", itemId: item.id, proposed }),
      });
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to submit change",
      );
    }
  };
  return (
    <main className="min-h-screen bg-white text-[#1E1F22] [--console-accent:#1E1F22] [--ink:#1E1F22] [--line:#D9D9D9] [--muted:#666666] [--primary:#1E1F22] [--surface:#F7F7F7]">
      <header className="border-b border-[#D9D9D9] bg-white px-5 py-5">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-[#666]">Stock and order operations</p>
      </header>
      <div className="mx-auto max-w-6xl space-y-6 p-5">
        {message && (
          <p
            role="alert"
            className="border border-[#D9D9D9] bg-[#F7F7F7] p-3 text-sm"
          >
            {message}
          </p>
        )}
        <section
          className="grid gap-3 sm:grid-cols-4"
          aria-label="Available merchant tools"
        >
          {permissions.map((key) => (
            <div
              key={key}
              className="border border-[#D9D9D9] bg-[#F7F7F7] p-3 text-sm"
            >
              <strong>{labels[key]}</strong>
              <span className="mt-1 block text-xs text-[#666]">
                {data.permissions[key] ? "Available" : "Restricted by owner"}
              </span>
            </div>
          ))}
        </section>
        {data.permissions.uploadStock && (
          <Card title="Upload stock">
            <form onSubmit={submit} className="grid gap-3 md:grid-cols-3">
              <input
                name="name"
                required
                placeholder="Item name"
                className="border border-[#D9D9D9] px-3 py-2"
              />
              <input
                name="sku"
                required
                placeholder="SKU"
                className="border border-[#D9D9D9] px-3 py-2"
              />
              <input
                name="category"
                required
                placeholder="Category"
                className="border border-[#D9D9D9] px-3 py-2"
              />
              <input
                name="pricePence"
                type="number"
                min="0"
                placeholder="Price pence"
                className="border border-[#D9D9D9] px-3 py-2"
              />
              <input
                name="stock"
                type="number"
                min="0"
                placeholder="Stock level"
                className="border border-[#D9D9D9] px-3 py-2"
              />
              <select
                name="availability"
                className="border border-[#D9D9D9] px-3 py-2"
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
                <option value="preorder">Pre-order</option>
              </select>
              <button className="border border-[#1E1F22] bg-[#1E1F22] px-4 py-2 font-semibold text-white md:col-span-3">
                Submit for owner approval
              </button>
            </form>
          </Card>
        )}
        <Card title="Stock and availability">
          <Table
            headers={[
              "Item",
              "Category",
              "Price",
              "Stock",
              "Availability",
              "Update",
            ]}
          >
            <>
              {data.inventory.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-semibold">
                    {item.name}
                    <span className="block text-xs text-[#666]">
                      {item.sku}
                    </span>
                  </td>
                  <td className="px-4 py-3">{item.category}</td>
                  <td className="px-4 py-3">{money(item.pricePence)}</td>
                  <td className="px-4 py-3">{item.stock}</td>
                  <td className="px-4 py-3">{item.availability}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {data.permissions.updatePrices && (
                        <button
                          onClick={() => {
                            const value = prompt(
                              "New price in pence",
                              String(item.pricePence),
                            );
                            if (value !== null)
                              void change(item, { pricePence: Number(value) });
                          }}
                          className="border border-[#D9D9D9] px-2 py-1 text-xs"
                        >
                          Price
                        </button>
                      )}
                      {data.permissions.uploadStock && (
                        <button
                          onClick={() => {
                            const value = prompt(
                              "New stock level",
                              String(item.stock),
                            );
                            if (value !== null)
                              void change(item, { stock: Number(value) });
                          }}
                          className="border border-[#D9D9D9] px-2 py-1 text-xs"
                        >
                          Stock
                        </button>
                      )}
                      {data.permissions.manageAvailability && (
                        <button
                          onClick={() =>
                            void change(item, {
                              availability:
                                item.availability === "available"
                                  ? "unavailable"
                                  : "available",
                            })
                          }
                          className="border border-[#D9D9D9] px-2 py-1 text-xs"
                        >
                          Availability
                        </button>
                      )}
                      {data.permissions.manageCategories && (
                        <button
                          onClick={() => {
                            const value = prompt("Category", item.category);
                            if (value) void change(item, { category: value });
                          }}
                          className="border border-[#D9D9D9] px-2 py-1 text-xs"
                        >
                          Category
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </>
          </Table>
        </Card>
        {data.permissions.viewOrders && (
          <Card title="Basic orders">
            <Table
              headers={["Reference", "Status", "Payment", "Delivery", "Total"]}
            >
              <>
                {data.orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 font-semibold">
                      {order.reference}
                    </td>
                    <td className="px-4 py-3">{order.status}</td>
                    <td className="px-4 py-3">{order.paymentStatus}</td>
                    <td className="px-4 py-3">{order.deliveryStatus}</td>
                    <td className="px-4 py-3">{money(order.totalPence)}</td>
                  </tr>
                ))}
              </>
            </Table>
          </Card>
        )}
        <Card title="Submitted changes">
          <Table headers={["Submitted", "Action", "Status", "Owner note"]}>
            <>
              {data.changes.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{item.action}</td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3">{item.reviewNote || "—"}</td>
                </tr>
              ))}
            </>
          </Table>
        </Card>
      </div>
    </main>
  );
}

export function MerchantPerformanceOverview({ client }: { client: MerchantClient }) {
  const [data, setData] = useState<OwnerData | null>(null);
  useEffect(() => {
    const load = () => client.request<{ success: true; data: OwnerData }>("/owner/merchants").then((response) => setData(response.data)).catch(() => setData(null));
    void load();
    const timer = window.setInterval(() => void load(), 15_000);
    return () => window.clearInterval(timer);
  }, [client]);
  const metrics = data?.metrics || { staff: 0, activeStaff: 0, pendingChanges: 0, approvedChanges: 0, inventoryItems: 0, orders: 0, revenuePence: 0 };
  return <section className="space-y-5" aria-label="Merchant performance overview"><div className="grid gap-4 md:grid-cols-4"><InsightPanel title="Active merchant staff" value={String(metrics.activeStaff)}/><InsightPanel title="Pending approvals" value={String(metrics.pendingChanges)} tone={metrics.pendingChanges ? "warning" : "default"}/><InsightPanel title="Merchant inventory" value={String(metrics.inventoryItems)}/><InsightPanel title="Order revenue" value={money(metrics.revenuePence)} tone="positive"/></div><Card title="Merchant operational performance"><BarChart data={[{ label: "Staff", value: metrics.activeStaff }, { label: "Approved changes", value: metrics.approvedChanges }, { label: "Inventory", value: metrics.inventoryItems }, { label: "Orders", value: metrics.orders }]}/></Card></section>;
}
export function OwnerMerchantManagement({
  client,
}: {
  client: MerchantClient;
}) {
  const [data, setData] = useState<OwnerData>({
    staff: [],
    changes: [],
    activity: [],
    inventory: [],
    orders: [],
    metrics: {
      staff: 0,
      activeStaff: 0,
      pendingChanges: 0,
      approvedChanges: 0,
      inventoryItems: 0,
      orders: 0,
      revenuePence: 0,
    },
  });
  const [message, setMessage] = useState("");
  const load = async () => {
    try {
      setData(
        (
          await client.request<{ success: true; data: OwnerData }>(
            "/owner/merchants",
          )
        ).data,
      );
      setMessage("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Merchant management unavailable",
      );
    }
  };
  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 15_000);
    return () => window.clearInterval(timer);
  }, [client]);
  const command = async (path: string, init: RequestInit = {}) => {
    try {
      const response = await client.request<{
        success?: true;
        data?: { temporaryPassword?: string };
      }>(path, init);
      if (response.data?.temporaryPassword)
        setMessage(`Temporary password: ${response.data.temporaryPassword}`);
      else setMessage("");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Command failed");
    }
  };
  const add = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget,
      value = new FormData(form),
      selected = Object.fromEntries(
        permissions.map((key) => [key, value.get(key) === "on"]),
      );
    await command("/owner/merchants/staff", {
      method: "POST",
      body: JSON.stringify({
        email: value.get("email"),
        role: value.get("role"),
        permissions: selected,
      }),
    });
    form.reset();
  };
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        <InsightPanel
          title="Merchant staff"
          value={String(data.metrics.staff)}
        />
        <InsightPanel
          title="Active access"
          value={String(data.metrics.activeStaff)}
          tone="positive"
        />
        <InsightPanel
          title="Pending changes"
          value={String(data.metrics.pendingChanges)}
          tone={data.metrics.pendingChanges ? "warning" : "default"}
        />
        <InsightPanel
          title="Merchant revenue"
          value={money(data.metrics.revenuePence)}
          tone="positive"
        />
      </div>
      {message && (
        <p
          role="status"
          className="border border-[var(--line)] bg-white p-3 text-sm"
        >
          {message}
        </p>
      )}
      <Card title="Add merchant staff">
        <form onSubmit={add} className="grid gap-3 md:grid-cols-3">
          <input
            name="email"
            type="email"
            required
            placeholder="Staff email"
            className="border px-3 py-2"
          />
          <select name="role" className="border px-3 py-2">
            <option value="Staff">Staff</option>
            <option value="Merchant">Merchant manager</option>
            <option value="MeatTrader">Meat trader</option>
          </select>
          <button className="bg-[var(--console-accent,var(--primary))] px-4 py-2 font-semibold text-white">
            Add staff
          </button>
          <div className="flex flex-wrap gap-3 md:col-span-3">
            {permissions.map((key) => (
              <label key={key} className="flex items-center gap-1 text-sm">
                <input type="checkbox" name={key} defaultChecked />
                {labels[key]}
              </label>
            ))}
          </div>
        </form>
      </Card>
      <Card title="Merchant staff and permissions">
        <Table headers={["User", "Role", "Access", "Permissions", "Actions"]}>
          <>
            {data.staff.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 font-semibold">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() =>
                      void command(`/owner/merchants/staff/${user.id}`, {
                        method: "PATCH",
                        body: JSON.stringify({ active: !user.active }),
                      })
                    }
                    className="border px-2 py-1 text-xs"
                  >
                    {user.active ? "Active" : "Suspended"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {permissions.map((key) => (
                      <label key={key} className="text-xs">
                        <input
                          type="checkbox"
                          checked={user.permissions[key]}
                          onChange={() =>
                            void command(`/owner/merchants/staff/${user.id}`, {
                              method: "PATCH",
                              body: JSON.stringify({
                                permissions: {
                                  ...user.permissions,
                                  [key]: !user.permissions[key],
                                },
                              }),
                            })
                          }
                        />
                        {labels[key]}
                      </label>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() =>
                      void command(
                        `/owner/merchants/staff/${user.id}/reset-password`,
                        { method: "POST", body: "{}" },
                      )
                    }
                    className="mr-2 border px-2 py-1 text-xs"
                  >
                    Reset password
                  </button>
                  <button
                    onClick={() =>
                      confirm("Remove merchant staff?") &&
                      void command(`/owner/merchants/staff/${user.id}`, {
                        method: "DELETE",
                      })
                    }
                    className="text-xs text-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </>
        </Table>
      </Card>
      <Card title="Pending merchant changes">
        <Table
          headers={["Submitted", "Action", "Proposed", "Status", "Review"]}
        >
          <>
            {data.changes.map((change) => (
              <tr key={change.id}>
                <td className="px-4 py-3">
                  <ClientDateTime value={change.createdAt} />
                </td>
                <td className="px-4 py-3">{change.action}</td>
                <td className="px-4 py-3">
                  <pre className="max-w-sm whitespace-pre-wrap text-xs">
                    {JSON.stringify(change.proposed, null, 1)}
                  </pre>
                </td>
                <td className="px-4 py-3">{change.status}</td>
                <td className="px-4 py-3">
                  {change.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          void command(
                            `/owner/merchants/changes/${change.id}`,
                            {
                              method: "PATCH",
                              body: JSON.stringify({ status: "approved" }),
                            },
                          )
                        }
                        className="mr-2 bg-[var(--console-accent,var(--primary))] px-2 py-1 text-xs text-white"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          void command(
                            `/owner/merchants/changes/${change.id}`,
                            {
                              method: "PATCH",
                              body: JSON.stringify({ status: "rejected" }),
                            },
                          )
                        }
                        className="border px-2 py-1 text-xs"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </>
        </Table>
      </Card>
      <Card title="Owner inventory overrides">
        <Table headers={["Item", "Price", "Stock", "Availability", "Override"]}>
          <>
            {data.inventory.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 font-semibold">{item.name}</td>
                <td className="px-4 py-3">{money(item.pricePence)}</td>
                <td className="px-4 py-3">{item.stock}</td>
                <td className="px-4 py-3">{item.availability}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => {
                      const value = prompt(
                        "Override price in pence",
                        String(item.pricePence),
                      );
                      if (value !== null)
                        void command(`/inventory/${item.id}`, {
                          method: "PATCH",
                          body: JSON.stringify({ pricePence: Number(value) }),
                        });
                    }}
                    className="mr-2 border px-2 py-1 text-xs"
                  >
                    Price
                  </button>
                  <button
                    onClick={() => {
                      const value = prompt(
                        "Override stock",
                        String(item.stock),
                      );
                      if (value !== null)
                        void command(`/inventory/${item.id}`, {
                          method: "PATCH",
                          body: JSON.stringify({ stock: Number(value) }),
                        });
                    }}
                    className="border px-2 py-1 text-xs"
                  >
                    Stock
                  </button>
                </td>
              </tr>
            ))}
          </>
        </Table>
      </Card>
      <Card title="Merchant activity log">
        <Table headers={["Time", "User", "Action", "Entity"]}>
          <>
            {data.activity.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <ClientDateTime value={item.createdAt} />
                </td>
                <td className="px-4 py-3">{item.userId}</td>
                <td className="px-4 py-3">{item.action}</td>
                <td className="px-4 py-3">{item.entity}</td>
              </tr>
            ))}
          </>
        </Table>
      </Card>
    </div>
  );
}
