import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon, Bell, Shield, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <SettingsIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">General</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">App preferences and basic settings</p>
            <Button variant="outline" className="w-full border-blue-200 text-blue-600">
              Configure
            </Button>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-green-200 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Bell className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">Notifications</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Manage your alert preferences</p>
            <Button variant="outline" className="w-full border-green-200 text-green-600">
              Configure
            </Button>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">Privacy</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Data and privacy settings</p>
            <Button variant="outline" className="w-full border-purple-200 text-purple-600">
              Configure
            </Button>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <HelpCircle className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold">Help & Support</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Get help and contact support</p>
            <Button variant="outline" className="w-full border-orange-200 text-orange-600">
              Get Help
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;