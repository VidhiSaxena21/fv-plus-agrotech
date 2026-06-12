'use client';

// import { Facebook, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
   <footer className="relative z-20 w-full py-10 px-6 md:px-10">
  <div className="max-w-7xl mx-auto">

    {/* Brand */}
    <div className="mb-8">
      <h2 className="text-white font-black text-3xl uppercase">
        FV PLUS
      </h2>

      <p className="text-white/40 text-xs tracking-[0.3em] uppercase mt-1">
        AGROTECH INNOVATIONS
      </p>
    </div>

    {/* Contact Info */}
    <div className="grid md:grid-cols-2 gap-8">

      {/* Address */}
      <div>
        <h3 className="text-white font-bold text-lg uppercase mb-3">
          Address
        </h3>

        <p className="text-white/60 leading-7">
          TIET-TAU Center Of Excellence For Food Security (T2CEFS)
          <br />
          Thapar Institute Of Engineering and Technology
          <br />
          Patiala, Punjab 147004
        </p>
      </div>

      {/* Contact */}
      <div>
        <h3 className="text-white font-bold text-lg uppercase mb-3">
          Contact
        </h3>

        <div className="space-y-3 text-white/60">
          <a
            href="mailto:directoryfvplus@gmail.com"
            className="block hover:text-[#10b981] transition-colors"
          >
            directoryfvplus@gmail.com
          </a>

          <a
            href="tel:+919878249089"
            className="block hover:text-[#10b981] transition-colors"
          >
            +91 98782 49089
          </a>
        </div>
      </div>

    </div>

    {/* Bottom */}
    <div className="mt-8 pt-5 border-t border-white/10">
      <p className="text-white/40 text-xs md:text-sm">
        © {new Date().getFullYear()} FV Plus Agrotech Innovations. All Rights Reserved.
      </p>
    </div>

  </div>
</footer>
  );
}