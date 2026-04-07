#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os

files = ['about.html', 'blog.html', 'contact.html', 'docs.html', 
         'services/school.html', 'services/competition.html', 
         'services/research.html', 'services/policy.html', 'services/cases.html']

for filepath in files:
    if not os.path.exists(filepath):
        print(f'File not found: {filepath}')
        continue
    
    with open(filepath, 'rb') as f:
        content = f.read()
    
    # Try UTF-8 first
    try:
        text = content.decode('utf-8')
        if text.encode('utf-8') == content:
            print(f'OK (UTF-8): {filepath}')
            continue
        else:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(text)
            print(f'Fixed UTF-8: {filepath}')
    except UnicodeDecodeError:
        pass
    
    # Try GBK and convert
    try:
        text = content.decode('gbk')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f'Converted (GBK->UTF-8): {filepath}')
    except:
        try:
            text = content.decode('gb18030')
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(text)
            print(f'Converted (GB18030->UTF-8): {filepath}')
        except Exception as e:
            print(f'Failed to convert {filepath}: {e}')

print('\nDone!')
