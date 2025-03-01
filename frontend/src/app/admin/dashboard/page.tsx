"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { api } from '@/config/api';
import { formatPrice } from '@/utils/format';
import { 
  ShoppingBag, 
  DollarSign, 
  CreditCard, 
  Clock, 
  TrendingUp, 
  Users, 
  Package, 
  Calendar, 
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  RefreshCcw
} from 'lucide-react';

// Tipos
interface OrderSummary {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string;
  total: number;
  status: string;
}

interface SalesByPeriod {
  period: string;
  sales: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#8b5cf6',
  muted: '#e2e8f0',
  background: '#f8fafc'
};

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<OrderSummary>({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    pendingOrders: 0
  });
  
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [salesByDay, setSalesByDay] = useState<SalesByPeriod[]>([]);
  const [salesByMonth, setSalesByMonth] = useState<SalesByPeriod[]>([]);
  const [salesByCategory, setSalesByCategory] = useState<{name: string, value: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Em um ambiente real, estas seriam chamadas à API
      // Aqui estamos usando dados simulados para demonstração
      
      // Dados de resumo
      setSummary({
        totalOrders: 156,
        totalRevenue: 15680.50,
        averageOrderValue: 100.52,
        pendingOrders: 12
      });
      
      // Pedidos recentes
      setRecentOrders([
        { id: '1', orderNumber: '#12345', customerName: 'João Silva', date: '2023-02-25', total: 125.90, status: 'completed' },
        { id: '2', orderNumber: '#12346', customerName: 'Maria Oliveira', date: '2023-02-24', total: 89.50, status: 'processing' },
        { id: '3', orderNumber: '#12347', customerName: 'Pedro Santos', date: '2023-02-24', total: 210.30, status: 'shipped' },
        { id: '4', orderNumber: '#12348', customerName: 'Ana Souza', date: '2023-02-23', total: 45.00, status: 'pending' },
        { id: '5', orderNumber: '#12349', customerName: 'Carlos Ferreira', date: '2023-02-22', total: 320.75, status: 'completed' },
      ]);
      
      // Vendas por dia (últimos 7 dias)
      setSalesByDay([
        { period: 'Seg', sales: 1200 },
        { period: 'Ter', sales: 1800 },
        { period: 'Qua', sales: 1500 },
        { period: 'Qui', sales: 2100 },
        { period: 'Sex', sales: 2400 },
        { period: 'Sáb', sales: 1800 },
        { period: 'Dom', sales: 1200 },
      ]);
      
      // Vendas por mês (últimos 6 meses)
      setSalesByMonth([
        { period: 'Set', sales: 12000 },
        { period: 'Out', sales: 18000 },
        { period: 'Nov', sales: 15000 },
        { period: 'Dez', sales: 21000 },
        { period: 'Jan', sales: 18000 },
        { period: 'Fev', sales: 24000 },
      ]);
      
      // Vendas por categoria
      setSalesByCategory([
        { name: 'Eletrônicos', value: 35 },
        { name: 'Roupas', value: 25 },
        { name: 'Acessórios', value: 15 },
        { name: 'Casa', value: 15 },
        { name: 'Outros', value: 10 },
      ]);
      
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'completed': 'Concluído',
      'processing': 'Em processamento',
      'shipped': 'Enviado',
      'pending': 'Pendente',
      'cancelled': 'Cancelado'
    };
    
    return statusMap[status] || status;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-500">Carregando dados do dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1">Visão geral da sua loja e desempenho de vendas.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => fetchDashboardData()}
          >
            <RefreshCcw size={14} />
            <span>Atualizar</span>
          </Button>
          
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <Button 
              variant={timeRange === 'week' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setTimeRange('week')}
              className="rounded-lg"
            >
              7D
            </Button>
            <Button 
              variant={timeRange === 'month' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setTimeRange('month')}
              className="rounded-lg"
            >
              30D
            </Button>
            <Button 
              variant={timeRange === 'year' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setTimeRange('year')}
              className="rounded-lg"
            >
              12M
            </Button>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total de Pedidos
              </CardTitle>
              <div className="p-2 bg-blue-500 text-white rounded-full">
                <ShoppingBag size={18} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">{summary.totalOrders}</div>
              <div className="flex items-center text-sm text-green-600 font-medium">
                <ArrowUpRight size={16} />
                <span>12%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Comparado ao período anterior</p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-gray-700">
                Receita Total
              </CardTitle>
              <div className="p-2 bg-green-500 text-white rounded-full">
                <DollarSign size={18} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">{formatPrice(summary.totalRevenue)}</div>
              <div className="flex items-center text-sm text-green-600 font-medium">
                <ArrowUpRight size={16} />
                <span>8.2%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Comparado ao período anterior</p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-gray-700">
                Valor Médio do Pedido
              </CardTitle>
              <div className="p-2 bg-purple-500 text-white rounded-full">
                <CreditCard size={18} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">{formatPrice(summary.averageOrderValue)}</div>
              <div className="flex items-center text-sm text-red-600 font-medium">
                <ArrowDownRight size={16} />
                <span>3.1%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Comparado ao período anterior</p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-amber-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-gray-700">
                Pedidos Pendentes
              </CardTitle>
              <div className="p-2 bg-amber-500 text-white rounded-full">
                <Clock size={18} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">{summary.pendingOrders}</div>
              <div className="flex items-center text-sm text-green-600 font-medium">
                <ArrowUpRight size={16} />
                <span>5%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Comparado ao período anterior</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-md">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Desempenho de Vendas</CardTitle>
                <CardDescription>Análise de vendas ao longo do tempo</CardDescription>
              </div>
              <Tabs defaultValue="bar" className="w-[180px]">
                <TabsList className="grid grid-cols-3 h-8">
                  <TabsTrigger value="bar" className="text-xs">Barras</TabsTrigger>
                  <TabsTrigger value="line" className="text-xs">Linha</TabsTrigger>
                  <TabsTrigger value="area" className="text-xs">Área</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Tabs defaultValue="bar" className="w-full">
                <TabsContent value="bar" className="mt-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timeRange === 'month' ? salesByMonth : salesByDay}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.muted} />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`R$ ${value}`, 'Vendas']} />
                      <Legend />
                      <Bar dataKey="sales" name="Vendas (R$)" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="line" className="mt-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={timeRange === 'month' ? salesByMonth : salesByDay}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.muted} />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`R$ ${value}`, 'Vendas']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        name="Vendas (R$)" 
                        stroke={CHART_COLORS.primary} 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="area" className="mt-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={timeRange === 'month' ? salesByMonth : salesByDay}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.muted} />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`R$ ${value}`, 'Vendas']} />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        name="Vendas (R$)" 
                        stroke={CHART_COLORS.primary} 
                        fill={`${CHART_COLORS.primary}33`} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-semibold">Vendas por Categoria</CardTitle>
            <CardDescription>Distribuição de vendas por categoria de produto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Porcentagem']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Pedidos Recentes */}
      <Card className="border-none shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Pedidos Recentes</CardTitle>
              <CardDescription>Últimos 5 pedidos recebidos</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Eye size={14} />
              <span>Ver todos</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-700 bg-gray-50 rounded-lg">
                <tr>
                  <th className="px-6 py-3 text-left">Pedido</th>
                  <th className="px-6 py-3 text-left">Cliente</th>
                  <th className="px-6 py-3 text-left">Data</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                    <td className="px-6 py-4">{order.customerName}</td>
                    <td className="px-6 py-4">{new Date(order.date).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4 font-medium">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                        Ver detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 