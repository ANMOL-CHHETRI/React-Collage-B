// import { useState } from "react";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="bg-neutral-primary fixed w-full z-20 top-0 border-b border-default">
//       <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
        
//         {/* Logo */}
//         <a
//           href="/"
//           className="flex items-center space-x-3 rtl:space-x-reverse"
//         >
//           <img
//             src="https://flowbite.com/docs/images/logo.svg"
//             className="h-7"
//             alt="Logo"
//           />
//           <span className="self-center text-xl text-heading font-semibold whitespace-nowrap">
//             Flowbite
//           </span>
//         </a>

//         {/* Right Section */}
//         <div className="flex items-center md:order-2 gap-2">
          
//           {/* Search Desktop */}
//           <div className="relative hidden md:block">
//             <div className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
//               <svg
//                 className="w-4 h-4 text-body"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeWidth="2"
//                   d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
//                 />
//               </svg>
//             </div>

//             <input
//               type="text"
//               className="block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
//               placeholder="Search"
//             />
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none"
//           >
//             {isOpen ? (
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeWidth="2"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeWidth="2"
//                   d="M5 7h14M5 12h14M5 17h14"
//                 />
//               </svg>
//             )}
//           </button>
//         </div>

//         {/* Menu */}
//         <div
//           className={`${
//             isOpen ? "block" : "hidden"
//           } w-full md:flex md:w-auto md:items-center md:order-1`}
//         >
          
//           {/* Mobile Search */}
//           <div className="relative mt-3 md:hidden">
//             <div className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
//               <svg
//                 className="w-4 h-4 text-body"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeWidth="2"
//                   d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
//                 />
//               </svg>
//             </div>

//             <input
//               type="text"
//               className="block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs"
//               placeholder="Search"
//             />
//           </div>

//           {/* Nav Links */}
//           <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent">
//             <li>
//               <a
//                 href="/"
//                 className="block py-2 px-3 text-white bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0"
//               >
//                 Home
//               </a>
//             </li>

//             <li>
//               <a
//                 href="/about"
//                 className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:hover:text-fg-brand md:p-0"
//               >
//                 About
//               </a>
//             </li>

//             <li>
//               <a
//                 href="/services"
//                 className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:hover:text-fg-brand md:p-0"
//               >
//                 Services
//               </a>
//             </li>

//             <li>
//               <a
//                 href="/contact"
//                 className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:hover:text-fg-brand md:p-0"
//               >
//                 Contact
//               </a>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


const Navbar = () => {
  return (
    <div>Navbar</div>
  )
}

export default Navbar