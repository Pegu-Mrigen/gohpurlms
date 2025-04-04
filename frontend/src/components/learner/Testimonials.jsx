import React from "react";
import { dummyTestimonial } from "./../../assets/assets";
import { assets } from "./../../assets/assets";

const Testimonials = () => {
  return (
    <div className="pb-14 px-8 md:px-0">
      <h2 className="text-3xl font-medium text-gray-800">Testimonials</h2>
      <p className="md:text-base text-gray-600 mt-3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, sint
        ipsam impedit magnam ratione deserunt error dolor ipsum <br /> eum
        corrupti aliquid modi voluptatibus at rem fugiat nostrum? Nam
        accusantium voluptatibus praesentium. Tempore.
      </p>
      <div className="grid grid-cols-auto gap-8 mt-14">
        {dummyTestimonial.map((testimonial, i) => (
          <div
            className="text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_55px_0px] shadow-black/20 overflow-hidden "
            key={i}
          >
            <div className=" flex items-center gap-4 px-5 py-4 bg-gray-500/30">
              <img
                className="h-12 w-12 rounded-full"
                src={testimonial.image}
                alt=""
              />
              <div className="">
                <h1 className="text-lg font-medium text-gray-800">
                  {testimonial.name}
                </h1>
                <p className="text-gray-800/80">{testimonial.role}</p>
              </div>
            </div>
            <div className="p-5 pb-7">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <img
                    src={
                      i < Math.ceil(testimonial.rating)
                        ? assets.star
                        : assets.star_blank
                    }
                    alt=""
                    className="h-5"
                  />
                ))}
              </div>
              <p className="text-gray-400 mt-5">{testimonial.feedback}</p>
            </div>
            <a href="#" className="text-blue-500 underline px-5">Read more</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
