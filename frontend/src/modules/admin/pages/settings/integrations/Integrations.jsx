import React, { useState } from 'react';
import { Mail, MessageSquare, Key, CreditCard, Shield, Info } from 'lucide-react';

// Sub Components
import IntegrationCategorySection from './components/IntegrationCategorySection';
import IntegrationCard from './components/IntegrationCard';
import ChangeConfirmationModal from './components/ChangeConfirmationModal';

const Integrations = () => {

    // Mock Integrations Data
    const initialIntegrations = [
        {
            id: 'sms',
            name: 'SMS Gateway',
            description: 'Send transactional alerts and OTPs via SMS.',
            icon: MessageSquare,
            category: 'communication',
            status: 'connected',
            enabled: true,
            lastSync: '10 mins ago',
            fields: [
                { id: 'provider', label: 'Provider', type: 'select', options: [{ value: 'twilio', label: 'Twilio' }, { value: 'msg91', label: 'MSG91' }, { value: 'aws_sns', label: 'AWS SNS' }] },
                { id: 'apiKey', label: 'API Key', type: 'secret', required: true, placeholder: 'sk_live_...' },
                { id: 'senderId', label: 'Sender ID', type: 'text', required: true, placeholder: 'EDUCRM' }
            ],
            config: { provider: 'twilio', senderId: 'SCHOOL' }
        },
        {
            id: 'email',
            name: 'Email Service',
            description: 'SMTP or API for system emails (Welcome, Invoice).',
            icon: Mail,
            category: 'communication',
            status: 'connected',
            enabled: true,
            lastSync: '2 mins ago',
            fields: [
                { id: 'host', label: 'SMTP Host', type: 'text', placeholder: 'smtp.sendgrid.net' },
                { id: 'port', label: 'Port', type: 'text', placeholder: '587' },
                { id: 'username', label: 'Username', type: 'text' },
                { id: 'password', label: 'Password', type: 'secret' }
            ],
            config: { host: 'smtp.mailgun.org', port: '587', username: 'postmaster@school.edu' }
        },
        {
            id: 'otp',
            name: 'OTP Service',
            description: 'Dedicated 2FA OTP provider (failover for SMS).',
            icon: Key,
            category: 'auth',
            status: 'not_configured',
            enabled: false,
            fields: [
                { id: 'provider', label: 'Provider', type: 'select', options: [{ value: 'auth0', label: 'Auth0' }, { value: 'firebase', label: 'Firebase Auth' }] },
                { id: 'appId', label: 'App ID', type: 'text' },
                { id: 'secret', label: 'Secret Key', type: 'secret' }
            ]
        },
        {
            id: 'payments',
            name: 'Payment Gateway (Razorpay)',
            description: 'Read-only sync for fee transaction status.',
            icon: CreditCard,
            category: 'finance',
            status: 'connected',
            enabled: true,
            readOnly: true, // Only synced, not configured here
            lastSync: 'Hourly Sync',
            fields: [
                { id: 'merchantId', label: 'Merchant ID', type: 'text', value: 'rzp_live_82...', readOnly: true },
                { id: 'webhook', label: 'Webhook URL', type: 'text', value: 'https://api.school.edu/hooks/rzp', readOnly: true }
            ],
            config: { merchantId: 'rzp_live_xxxxxxxx', webhook: '...' }
        }
    ];

    const [integrations, setIntegrations] = useState(initialIntegrations);
    const [confirmAction, setConfirmAction] = useState(null); // { type: 'enable'|'disable', integrationId, integrationName }

    // Handlers
    const handleUpdateConfig = (id, newConfig) => {
        setIntegrations(prev => prev.map(item => item.id === id ? { ...item, config: newConfig } : item));
        console.log(`[AUDIT] Integration Config Updated | ID: ${id} | Time: ${new Date().toISOString()}`);
        alert("Configuration saved locally.");
    };

    const handleTestParams = (id, config) => {
        const integration = integrations.find(i => i.id === id);
        // Simulate Test
        alert(`Testing connection for ${integration.name}...\n\n(Simulated Success)`);
    };

    const handleToggleRequest = (id, enable) => {
        const integration = integrations.find(i => i.id === id);
        setConfirmAction({
            type: enable ? 'enable' : 'disable',
            integrationId: id,
            integrationName: integration.name
        });
    };

    const confirmToggle = () => {
        if (!confirmAction) return;
        setIntegrations(prev => prev.map(item =>
            item.id === confirmAction.integrationId
                ? { ...item, enabled: confirmAction.type === 'enable', status: confirmAction.type === 'enable' ? 'connected' : 'disabled' }
                : item
        ));
        console.log(`[AUDIT] Integration ${confirmAction.type.toUpperCase()}D | ID: ${confirmAction.integrationId}`);
        setConfirmAction(null);
    };

    // Filter by Category
    const communicationIntegrations = integrations.filter(i => i.category === 'communication');
    const authIntegrations = integrations.filter(i => i.category === 'auth');
    const financeIntegrations = integrations.filter(i => i.category === 'finance');

    return (
        <div className="flex flex-col min-h-[calc(100vh-10rem)] overflow-hidden bg-gray-50 border border-gray-200 rounded-xl -mx-4 md:-mx-6 relative">

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm z-10 sticky top-0">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-gray-900 font-['Poppins']">Integrations</h1>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wider">Secure Zone</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        External Services • API Gateways • Webhooks
                        <Info size={14} className="text-gray-400" />
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
                <div className="max-w-6xl mx-auto space-y-10 pb-10">

                    <IntegrationCategorySection
                        title="Communication Channels"
                        description="Manage gateways for SMS alerts, Email notifications, and WhatsApp messaging."
                    >
                        {communicationIntegrations.map(integration => (
                            <IntegrationCard
                                key={integration.id}
                                integration={integration}
                                onUpdate={handleUpdateConfig}
                                onTest={handleTestParams}
                                onToggle={handleToggleRequest}
                            />
                        ))}
                    </IntegrationCategorySection>

                    <div className="border-t border-gray-200"></div>

                    <IntegrationCategorySection
                        title="Authentication & Identity"
                        description="Configure SSO, OTP providers, and social login connectors."
                    >
                        {authIntegrations.map(integration => (
                            <IntegrationCard
                                key={integration.id}
                                integration={integration}
                                onUpdate={handleUpdateConfig}
                                onTest={handleTestParams}
                                onToggle={handleToggleRequest}
                            />
                        ))}
                    </IntegrationCategorySection>

                    <div className="border-t border-gray-200"></div>

                    <IntegrationCategorySection
                        title="Financial Services"
                        description="Monitor connectivity with Payment Gateways."
                    >
                        {financeIntegrations.map(integration => (
                            <IntegrationCard
                                key={integration.id}
                                integration={integration}
                                onUpdate={handleUpdateConfig}
                                onTest={handleTestParams}
                                onToggle={handleToggleRequest}
                            />
                        ))}
                    </IntegrationCategorySection>

                </div>
            </div>

            {/* Modal */}
            {confirmAction && (
                <ChangeConfirmationModal
                    action={confirmAction}
                    onConfirm={confirmToggle}
                    onCancel={() => setConfirmAction(null)}
                />
            )}

        </div>
    );
};

export default Integrations;
