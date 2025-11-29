import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl">
              <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">John Smith</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-medium">john.smith@example.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <Phone className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium">+91 9876543210</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">Mumbai, India</p>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                Edit Profile
              </Button>
            </Card>
          </div>

          <div>
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-green-200 rounded-2xl text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-white shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-green-600 text-white text-2xl">
                  JS
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold mb-2">John Smith</h3>
              <p className="text-gray-600 mb-4">SecurePay User</p>
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium inline-block">
                Verified Account
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;