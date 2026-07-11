import React, { useState, useEffect } from 'react';
import { salesApi } from '../../api/salesApi';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/formatCurrency';
import { HiSearch, HiOutlineDocumentReport, HiOutlineCash } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await salesApi.getAllSales();
        setSales(data);
      } catch (err) {
        toast.error('Failed to load sales transaction logs.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  // Filter list
  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customerPhone.includes(searchQuery) ||
      (sale.saleNumber && sale.saleNumber.toString().includes(searchQuery)) ||
      (sale.productId?.name && sale.productId.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  // Calculate accumulated totals
  const totalRevenue = filteredSales.reduce((acc, sale) => acc + (sale.negotiatedPrice || 0), 0);

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-walnut-brown leading-tight">
          Sales Audit Logs
        </h1>
        <p className="text-xs text-charcoal-text/50 font-medium">Immutable snapshots created automatically when orders are delivered.</p>
      </div>

      {/* Top summary counter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-walnut-brown/10 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-charcoal-text/50 uppercase tracking-wider block">Delivered Transactions</span>
            <span className="text-xl font-extrabold text-walnut-brown">{filteredSales.length} Completed Sales</span>
          </div>
          <div className="p-3 bg-walnut-brown/5 rounded-xl text-walnut-brown">
            <HiOutlineDocumentReport size={22} />
          </div>
        </div>

        <div className="bg-walnut-brown text-warm-cream p-5 rounded-2xl border border-walnut-brown shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-warm-cream/70 uppercase tracking-wider block">Sum of Filtered Sales</span>
            <span className="text-xl font-extrabold text-white">{formatCurrency(totalRevenue)}</span>
          </div>
          <div className="p-3 bg-white/10 text-white rounded-xl">
            <HiOutlineCash size={22} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-walnut-brown/10 shadow-xs">
        <div className="relative w-full sm:w-64">
          <span className="absolute inset-y-0 left-3 flex items-center text-charcoal-text/40">
            <HiSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Search client, phone, cot name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-walnut-brown/15 bg-warm-cream/20 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut-brown/20 focus:border-walnut-brown w-full"
          />
        </div>
      </div>

      {/* Table view */}
      {loading ? (
        <Loader type="spinner" className="min-h-[40vh]" />
      ) : filteredSales.length > 0 ? (
        <div className="bg-white rounded-2xl border border-walnut-brown/15 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-walnut-brown/10">
              <thead className="bg-walnut-brown/5 text-left text-xs font-bold text-walnut-brown uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Sale Ref</th>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Purchased Product</th>
                  <th className="px-6 py-4">Amount Audited</th>
                  <th className="px-6 py-4">Delivery Completed On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-walnut-brown/5 text-sm text-charcoal-text">
                {filteredSales.map((sale) => {
                  const formattedDate = new Date(sale.createdAt).toLocaleDateString('en-KE', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={sale._id} className="hover:bg-walnut-brown/2 transition-colors">
                      <td className="px-6 py-4 font-bold text-walnut-brown">
                        #{sale.saleNumber || sale._id.substring(18)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-charcoal-text">{sale.customerName}</div>
                        <div className="text-xs text-charcoal-text/50 font-medium">{sale.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {sale.productId?.name || 'Handmade Furniture'}
                        <span className="text-[10px] font-bold text-charcoal-text/40 block mt-0.5">
                          {sale.productId?.category || 'Custom Order'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-walnut-brown">
                        {formatCurrency(sale.negotiatedPrice)}
                      </td>
                      <td className="px-6 py-4 text-charcoal-text/60 font-medium">
                        {formattedDate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No completed transactions logged"
          description="Sales are logged automatically when order statuses move to 'Delivered'."
        />
      )}

    </div>
  );
}
