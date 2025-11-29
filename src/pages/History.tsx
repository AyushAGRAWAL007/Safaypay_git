import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const History = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
        </div>

        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-10 border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>
            <Button variant="outline" className="border-gray-300">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="border-gray-300">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
            <p className="text-gray-600 mb-4">Your transaction history will appear here</p>
            <Link to="/transaction">
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                Make Your First Transaction
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default History;