'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Product } from '@/types/product';
import { getAdminProductById } from '@/data/adminStore';
import { ProductForm } from '@/components/admin/ProductForm';

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const p = getAdminProductById(id);
      if (p) setProduct(p);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-outline text-xs">Loading product metadata...</div>;
  }

  if (!product) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <h2 className="font-display font-bold text-xl text-on-surface">Product Not Found</h2>
        <p className="text-xs text-outline">The requested SKU or product identifier does not exist.</p>
        <Link
          href="/admin/catalogue"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary text-on-secondary font-label-md text-xs uppercase font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Catalogue</span>
        </Link>
      </div>
    );
  }

  return <ProductForm initialProduct={product} isEditMode={true} />;
}
