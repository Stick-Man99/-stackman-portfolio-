#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Simple HTTP server with UTF-8 support for Stack Man website
"""

import http.server
import socketserver
import os
import mimetypes

PORT = 8081

# Register MIME types
mimetypes.add_type('text/html; charset=utf-8', '.html')
mimetypes.add_type('text/html; charset=utf-8', '.htm')
mimetypes.add_type('text/css; charset=utf-8', '.css')
mimetypes.add_type('application/javascript; charset=utf-8', '.js')

class UTF8Handler(http.server.SimpleHTTPRequestHandler):
    """HTTP handler that serves files with UTF-8 support"""
    
    def do_GET(self):
        # Change to the script's directory
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        
        # Handle root path - serve index.html
        if self.path == '/':
            self.path = '/index.html'
        
        return super().do_GET()
    
    def guess_type(self, path):
        """Override to ensure UTF-8 charset for text files"""
        base_type = super().guess_type(path)
        if base_type.startswith('text/'):
            return base_type + '; charset=utf-8'
        if base_type == 'application/javascript':
            return base_type + '; charset=utf-8'
        if base_type == 'text/css':
            return base_type + '; charset=utf-8'
        return base_type
    
    def end_headers(self):
        # Always add UTF-8 charset for text files
        self.send_header('Content-Type', self.guess_type(self.path))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == '__main__':
    # Change to the script's directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Allow socket reuse
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("", PORT), UTF8Handler) as httpd:
        print(f"Server running at http://localhost:{PORT}/")
        print("Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")
