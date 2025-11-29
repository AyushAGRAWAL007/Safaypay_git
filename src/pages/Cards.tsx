import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Cards = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Manage Cards</h1>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Card
          </Button>
        </div>

        <Card className="p-8 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <CreditCard className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No cards added yet</h3>
            <p className="text-gray-600 mb-6">Add your debit or credit cards to make secure payments</p>
            <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Card
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Cards;