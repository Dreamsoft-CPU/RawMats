// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

import { render, screen } from "@testing-library/react";
import HomeSidebar from "@/components/home/HomeSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const mockData = {
  isAdmin: false,
  isSupplier: false,
  isSupplierPending: false,
  user: {
    name: "Test User",
    email: "test@example.com",
    avatar: "/avatar.png",
  },
};

describe("HomeSidebar", () => {
  it("renders basic navigation items", () => {
    render(
      <SidebarProvider>
        <HomeSidebar data={mockData} />
      </SidebarProvider>,
    );

    // Check for navigation items using role and name
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /favorites/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /conversations/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /help center/i }),
    ).toBeInTheDocument();
  });

  it("shows Apply as Supplier option when user is not a supplier", () => {
    render(
      <SidebarProvider>
        <HomeSidebar data={mockData} />
      </SidebarProvider>,
    );

    expect(
      screen.getByRole("link", { name: /apply as a supplier/i }),
    ).toBeInTheDocument();
  });

  it("hides Apply as Supplier option when user is a supplier", () => {
    const supplierData = { ...mockData, isSupplier: true };
    render(
      <SidebarProvider>
        <HomeSidebar data={supplierData} />
      </SidebarProvider>,
    );

    expect(
      screen.queryByRole("link", { name: /apply as a supplier/i }),
    ).not.toBeInTheDocument();
  });

  it("hides Apply as Supplier option when user is pending supplier", () => {
    const pendingSupplierData = { ...mockData, isSupplierPending: true };
    render(
      <SidebarProvider>
        <HomeSidebar data={pendingSupplierData} />
      </SidebarProvider>,
    );

    expect(
      screen.queryByRole("link", { name: /apply as a supplier/i }),
    ).not.toBeInTheDocument();
  });
});
