import React from 'react';
import { Certificate } from '../../types';
import { Shield, ShieldAlert, ShieldCheck, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface CertificateListProps {
  certificates: Certificate[];
}

export default function CertificateList({ certificates }: CertificateListProps) {
  const getCertificateStatus = (cert: Certificate) => {
    if (!cert.isValid) return 'invalid';
    if (cert.daysUntilExpiry <= 7) return 'critical';
    if (cert.daysUntilExpiry <= 30) return 'warning';
    return 'valid';
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'valid':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <ShieldCheck className="w-4 h-4" />,
          label: 'Valid'
        };
      case 'warning':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Shield className="w-4 h-4" />,
          label: 'Expires Soon'
        };
      case 'critical':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <ShieldAlert className="w-4 h-4" />,
          label: 'Expires Very Soon'
        };
      case 'invalid':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <ShieldAlert className="w-4 h-4" />,
          label: 'Invalid'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <Shield className="w-4 h-4" />,
          label: 'Unknown'
        };
    }
  };

  if (certificates.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
        <p className="text-gray-500">SSL certificates will appear here when monitors are configured.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {certificates.map((cert) => {
        const status = getCertificateStatus(cert);
        const statusConfig = getStatusConfig(status);
        
        return (
          <div key={cert.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{cert.domain}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                    {statusConfig.icon}
                    <span className="ml-1">{statusConfig.label}</span>
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Issuer</p>
                    <p className="font-medium text-gray-900">{cert.issuer}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 mb-1">Valid From</p>
                    <p className="font-medium text-gray-900">{format(cert.validFrom, 'MMM dd, yyyy')}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 mb-1">Valid To</p>
                    <p className="font-medium text-gray-900">{format(cert.validTo, 'MMM dd, yyyy')}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 mb-1">Days Until Expiry</p>
                    <p className={`font-medium ${
                      cert.daysUntilExpiry <= 7 ? 'text-red-600' : 
                      cert.daysUntilExpiry <= 30 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {cert.daysUntilExpiry} days
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Last checked: {format(cert.lastChecked, 'MMM dd, HH:mm')}
                </span>
              </div>
            </div>
            
            {cert.daysUntilExpiry <= 30 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Certificate Renewal Reminder:</strong> This certificate will expire in {cert.daysUntilExpiry} days. 
                  Please renew it to avoid service interruption.
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}