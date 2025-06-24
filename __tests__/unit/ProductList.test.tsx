import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductList from '@/components/supplier/products/ProductList';
import { UserDataProps } from '@/lib/interfaces/ProductListProps';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

jest.mock('@/components/supplier/products/CreateProductForm', () => ({
  __esModule: true,
  default: () => <button>Create New Product</button>,
}));

jest.mock('@/components/supplier/products/EditProductForm', () => ({
  __esModule: true,
  default: () => <button>Edit Product</button>,
}));

describe('ProductList Component', () => {
  // Setup mock user data
  const mockUserData: UserDataProps['userData'] = {
    displayName: 'Lois',
    id: 'user-1',
    role: 'USER',
    email: 'lois@example.com',
    profilePicture: '',
    phoneNumber: '1234567890',
    createdAt: new Date(),
    updatedAt: new Date(),
    Supplier: [
      {
        id: "supplier-1",
        userId: "user-1",
        businessPicture: "business-pic.png",
        businessName: "Business Name",
        businessLocation: "Location",
        businessPhone: "123-456-7890",
        businessDocuments: ["document1.pdf"],
        bio: "This is the bio.",
        verified: true,
        verifiedDate: new Date(),
        Product: [
          {
            id: 'prod-1',
            name: 'Rice',
            description: 'Premium white rice',
            price: 55,
            image: '/rice.png',
            supplierId: 'supplier-1',
            verified: true,
            verifiedDate: new Date(),
            dateAdded: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            favorites: [],
          },
        ],
      },
    ],
    Notification: [],
  };

  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('renders the product list and search input', () => {
    render(<ProductList userData={mockUserData} />);
    expect(screen.getByPlaceholderText(/search products/i)).toBeInTheDocument();
    expect(screen.getByText('Rice')).toBeInTheDocument();
  });

  it('filters products based on search term', () => {
    render(<ProductList userData={mockUserData} />);
    const input = screen.getByPlaceholderText(/search products/i);
    fireEvent.change(input, { target: { value: 'rice' } });

    expect(screen.getByText('Rice')).toBeInTheDocument();
    expect(screen.queryByText('Corn')).not.toBeInTheDocument();
  });

  it('shows empty state when no products match', () => {
    render(<ProductList userData={mockUserData} />);
    const input = screen.getByPlaceholderText(/search products/i);
    fireEvent.change(input, { target: { value: 'banana' } });

    expect(screen.queryByText('Rice')).not.toBeInTheDocument();
    expect(screen.queryByText('Corn')).not.toBeInTheDocument();
    expect(screen.getByText(/no products match your search/i)).toBeInTheDocument();
  });

  it('renders accordion content including EditProductForm', () => {
    render(<ProductList userData={mockUserData} />);
    fireEvent.click(screen.getAllByText('Rice')[0]);

    expect(screen.getByText('Premium white rice')).toBeInTheDocument();
    expect(screen.getByText('Edit Product')).toBeInTheDocument();
  });
});
