import urllib.request, json

req = urllib.request.Request(
    'https://scorecard-production-e741.up.railway.app/api/conrad/percentile',
    headers={'x-api-key': '6cefbca609d6f935f9ff82ad234435c90eca70a0d8e46c6b1e6a151438faa93a'}
)
d = json.loads(urllib.request.urlopen(req).read())

# Show top-level keys
print('TOP KEYS:', list(d.keys()))

# Show ceiBuying/2025 keys
y = d['ceiBuying']['2025']
print('YEAR KEYS:', list(y.keys()))

# Show tiers keys and structure
tiers = y.get('tiers', {})
print('\nTIERS KEYS:', list(tiers.keys()))
print('TIERS top80:', json.dumps(tiers.get('top80')))

# Look for supplier arrays elsewhere
for k, v in y.items():
    if isinstance(v, list):
        print(f'\nLIST FOUND at y[{k!r}], len={len(v)}')
        if v:
            print('  FIRST ITEM:', json.dumps(v[0]))
    elif isinstance(v, dict):
        for k2, v2 in v.items():
            if isinstance(v2, list):
                print(f'\nLIST FOUND at y[{k!r}][{k2!r}], len={len(v2)}')
                if v2:
                    print('  FIRST ITEM:', json.dumps(v2[0]))
