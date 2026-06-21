"""Descarga imágenes; usa picsum.photos como respaldo si Unsplash falla."""
import urllib.request
import os

BASE = os.path.join(os.path.dirname(__file__), '..', 'images')

IMAGES = {
    'sliders/slider1.jpg': ('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=400&fit=crop&q=80', 'gaming1'),
    'sliders/slider2.jpg': ('https://images.unsplash.com/photo-1600860439954-b3077482624e?w=1200&h=400&fit=crop&q=80', 'gaming2'),
    'sliders/slider3.jpg': ('https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=400&fit=crop&q=80', 'gaming3'),
    'products/01-rog-strix.jpg': ('https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop&q=80', 'laptop'),
    'products/02-ram-ddr5.jpg': ('https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=300&fit=crop&q=80', 'ram'),
    'products/03-intel-core.jpg': ('https://images.unsplash.com/photo-1518770660439-971081894452?w=400&h=300&fit=crop&q=80', 'cpu'),
    'products/04-rog-ally.jpg': ('https://images.unsplash.com/photo-1612287230202-66c141705ecc?w=400&h=300&fit=crop&q=80', 'handheld'),
    'products/05-teclado-razer.jpg': ('https://images.unsplash.com/photo-1618384889399-342388a2b9aa?w=400&h=300&fit=crop&q=80', 'keyboard'),
    'products/06-mouse-logitech.jpg': ('https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop&q=80', 'mouse'),
    'products/07-monitor-msi.jpg': ('https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop&q=80', 'monitor'),
    'products/08-auriculares-hyperx.jpg': ('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&q=80', 'headphones'),
    'products/09-ssd-samsung.jpg': ('https://images.unsplash.com/photo-1531498865501-8894c37e7d87?w=400&h=300&fit=crop&q=80', 'ssd'),
    'products/10-rtx-4070.jpg': ('https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop&q=80', 'gpu'),
    'products/11-silla-gaming.jpg': ('https://images.unsplash.com/photo-1598550476439-68477869f438?w=400&h=300&fit=crop&q=80', 'chair'),
    'products/12-webcam-logitech.jpg': ('https://images.unsplash.com/photo-1614624335511-aa1c3dc5f0c4?w=400&h=300&fit=crop&q=80', 'webcam'),
    'products/13-libro-clean-code.jpg': ('https://images.unsplash.com/photo-1495446815901-a15287db5a21?w=400&h=300&fit=crop&q=80', 'book1'),
    'products/14-camiseta.jpg': ('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop&q=80', 'shirt'),
    'products/15-zapatillas-nike.jpg': ('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&q=80', 'shoes'),
    'products/16-smartwatch.jpg': ('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&q=80', 'watch'),
    'products/17-tablet-samsung.jpg': ('https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop&q=80', 'tablet'),
    'products/18-router-wifi.jpg': ('https://images.unsplash.com/photo-1558494949-79c225048196?w=400&h=300&fit=crop&q=80', 'router'),
    'products/19-microfono-blue.jpg': ('https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop&q=80', 'mic'),
    'products/20-mochila-razer.jpg': ('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&q=80', 'backpack'),
    'products/21-ps5.jpg': ('https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop&q=80', 'ps5'),
    'products/22-libro-arte-guerra.jpg': ('https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop&q=80', 'book2'),
}

def download(path, url, seed):
    dest = os.path.join(BASE, path.replace('/', os.sep))
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    is_slider = 'sliders' in path
    w, h = (1200, 400) if is_slider else (400, 300)
    fallback = f'https://picsum.photos/seed/{seed}/{w}/{h}.jpg'
    for try_url in (url, fallback):
        try:
            req = urllib.request.Request(try_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
            if len(data) < 1000:
                continue
            with open(dest, 'wb') as f:
                f.write(data)
            print(f'OK {path} ({len(data)} bytes) via {try_url[:50]}...')
            return
        except Exception as e:
            print(f'  retry {path}: {e}')
    print(f'FAIL {path}')

if __name__ == '__main__':
    for path, (url, seed) in IMAGES.items():
        download(path, url, seed)
