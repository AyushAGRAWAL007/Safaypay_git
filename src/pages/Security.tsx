import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Bell, MapPin, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const Security = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Security Features</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Biometric Authentication</p>
                    <p className="text-sm text-gray-600">Use fingerprint or face ID</p>
                  </div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Security Alerts</p>
                    <p className="text-sm text-gray-600">Get notified for unusual activity</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Location Tracking</p>
                    <p className="text-sm text-gray-600">Monitor transaction locations</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-green-200 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold">Device Management</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">Current Device</p>
                <p className="text-sm text-gray-600">This device • Active now</p>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                Manage Devices
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Security;