import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateProductForm from '@/components/supplier/products/CreateProductForm';
import { useRouter } from "next/navigation";


jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("CreateProductForm Component", () => {
  beforeEach(() => {
    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    global.fetch = jest.fn();

    jest.spyOn(console, 'warn').mockImplementation((message) => {
      if (message.includes('Missing `Description` or `aria-describedby={undefined}`')) {
        return; 
      }
      console.warn(message); 
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the form correctly when the dialog is opened', () => {
    render(<CreateProductForm supplierId="123" />);

    fireEvent.click(screen.getByRole('button', { name: /create new product/i }));

    expect(screen.getByPlaceholderText('Enter product name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Describe the product')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create product/i })).toBeInTheDocument();
  });
});