'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface NotionLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  addedAt: string;
}

interface KnowledgeBaseViewerProps {
  link: NotionLink;
}

export function KnowledgeBaseViewer({ link }: KnowledgeBaseViewerProps) {
  const [iframeKey, setIframeKey] = useState(0);

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenInNewTab = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800">{link.title}</h2>
          {link.description && (
            <p className="text-sm text-gray-500 mt-1">{link.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            title="刷新"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenInNewTab}
            title="在新标签页打开"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            打开
          </Button>
        </div>
      </div>

      <div className="relative bg-white" style={{ height: 'calc(100vh - 250px)' }}>
        <iframe
          key={iframeKey}
          src={link.url}
          className="w-full h-full border-0"
          title={link.title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          loading="lazy"
        />
      </div>

      <div className="bg-gray-50 p-3 text-xs text-gray-500 border-t">
        <div className="flex items-center justify-between">
          <span>URL: {link.url}</span>
          <span>添加时间: {new Date(link.addedAt).toLocaleDateString('zh-CN')}</span>
        </div>
      </div>
    </Card>
  );
}
