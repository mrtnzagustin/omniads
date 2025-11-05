/**
 * Mock Tienda Nube API Client
 * Simulates responses from Tienda Nube e-commerce platform API
 */

export interface TiendaNubeProduct {
  id: string;
  name: string;
  price: number;
  sku: string;
  stock: number;
  organicViews: number;
  organicSales: number;
}

export interface TiendaNubeSale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  amount: number;
  soldAt: Date;
  items: string[];
}

export class TiendaNubeApiMock {
  /**
   * Fetches product catalog from Tienda Nube
   */
  async getProducts(): Promise<TiendaNubeProduct[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return [
      {
        id: 'tn_prod_001',
        name: 'Vestido Lino Crudo',
        price: 52990,
        sku: 'VLC-001',
        stock: 45,
        organicViews: 2200,
        organicSales: 200,
      },
      {
        id: 'tn_prod_002',
        name: 'Jean Mom Celeste',
        price: 45990,
        sku: 'JMC-002',
        stock: 120,
        organicViews: 3500,
        organicSales: 280,
      },
      {
        id: 'tn_prod_003',
        name: 'Remera Básica Blanca',
        price: 18990,
        sku: 'RBB-003',
        stock: 200,
        organicViews: 5100,
        organicSales: 450,
      },
      {
        id: 'tn_prod_004',
        name: 'Saco Lino Beige',
        price: 68990,
        sku: 'SLB-004',
        stock: 32,
        organicViews: 1800,
        organicSales: 90,
      },
      {
        id: 'tn_prod_005',
        name: 'Tapado Paño Gris',
        price: 89990,
        sku: 'TPG-005',
        stock: 15,
        organicViews: 950,
        organicSales: 28,
      },
    ];
  }

  /**
   * Fetches sales transactions from Tienda Nube
   */
  async getSales(startDate: Date, endDate: Date): Promise<TiendaNubeSale[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 120));

    return [
      {
        id: 'sale_001',
        productId: 'tn_prod_001',
        productName: 'Vestido Lino Crudo',
        quantity: 2,
        amount: 105980,
        soldAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        items: ['tn_prod_001'],
      },
      {
        id: 'sale_002',
        productId: 'tn_prod_002',
        productName: 'Jean Mom Celeste',
        quantity: 1,
        amount: 64980,
        soldAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        items: ['tn_prod_002', 'tn_prod_003'],
      },
      {
        id: 'sale_003',
        productId: 'tn_prod_003',
        productName: 'Remera Básica Blanca',
        quantity: 3,
        amount: 56970,
        soldAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
        items: ['tn_prod_003'],
      },
      {
        id: 'sale_004',
        productId: 'tn_prod_004',
        productName: 'Saco Lino Beige',
        quantity: 1,
        amount: 68990,
        soldAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        items: ['tn_prod_004'],
      },
    ];
  }

  /**
   * Analyzes frequently bought together patterns
   */
  async getBundleOpportunities(): Promise<{ product1: string; product2: string; frequency: number }[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return [
      {
        product1: 'Jean Mom Celeste',
        product2: 'Remera Básica Blanca',
        frequency: 38,
      },
      {
        product1: 'Vestido Lino Crudo',
        product2: 'Saco Lino Beige',
        frequency: 22,
      },
    ];
  }
}
