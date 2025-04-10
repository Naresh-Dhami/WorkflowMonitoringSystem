
import React from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const { currentEnvironment } = useEnvironment();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the monitoring dashboard for environment: {currentEnvironment.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>AMPS Monitoring</CardTitle>
              <CardDescription>
                View and manage AMPS messages and topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Access detailed information about AMPS messages, topics, and server status.
              </p>
              <Button asChild>
                <Link to="/amps-viewer">Open AMPS Viewer</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grid Gain Monitoring</CardTitle>
              <CardDescription>
                View and manage Grid Gain servers and caches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Access detailed information about Grid Gain server details and status.
              </p>
              <Button asChild>
                <Link to="/grid-gain-viewer">Open Grid Gain Viewer</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
