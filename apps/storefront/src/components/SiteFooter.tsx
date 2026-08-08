export function SiteFooter() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="container-page py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-serif text-lg font-semibold text-brand-800">TWA Fashion</h3>
            <p className="mt-2 text-sm text-gray-600">
              Crafted for the Modern Indian Wardrobe
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><a href="/products" className="hover:text-brand-700">All Products</a></li>
              <li><a href="/products?tag=new-arrival" className="hover:text-brand-700">New Arrivals</a></li>
              <li><a href="/products?tag=best-seller" className="hover:text-brand-700">Best Sellers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Help</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><a href="/policies" className="hover:text-brand-700">Policies</a></li>
              <li><a href="/contact" className="hover:text-brand-700">Contact Us</a></li>
              <li><a href="/about" className="hover:text-brand-700">About Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Contact</h4>
            <p className="mt-3 text-sm text-gray-600">hello@twafashion.in</p>
            <p className="text-sm text-gray-600">+91 98765 43210</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} TWA Fashion Pvt. Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
