"use client";

import { ChangeEvent, useState, FormEvent } from "react";
import { messageSchema } from "@/schemas/message.schema";
import { ValidationError } from "yup"; // Assuming you are using 'yup' for schema validation
import AutoAlert from "@/components/alert";

interface Idata {
  username: string;
  email: string;
  phonenumber: string;
  message: string;
}

export default function Home() {
  const [data, setData] = useState<Idata>({
    username: "",
    email: "",
    phonenumber: "",
    message: ""
  });

  // Type errors as Record<keyof Idata, string> to match the form data fields
  const [errors, setErrors] = useState<Record<keyof Idata, string>>({
    username: "",
    email: "",
    phonenumber: "",
    message: ""
  });

  const [alertVisible, setAlertVisible] = useState(false);

  const handleShowAlert = () => {
    setAlertVisible(true);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  // Handle change for individual inputs and perform validation on that field
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Initialize error state
    const newErrors: Record<keyof Idata, string> = {
      username: "",
      email: "",
      phonenumber: "",
      message: ""
    };

    try {
      // Validate the entire form at once
      await messageSchema.validate(data, { abortEarly: false });

      //If validation passes, proceed with form submission
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if(res.ok){
        handleShowAlert();
      }
      // You can send the data to an API here, or perform other actions
    } catch (error) {
      // Type the error as ValidationError to access 'inner' array and other properties
      if (error instanceof ValidationError) {
        error.inner.forEach((err) => {
          newErrors[err.path as keyof Idata] = err.message; // Safe casting here
        });
      }

      // Set errors state with validation errors
      setErrors(newErrors);
      return; // Prevent form submission if there are errors
    }
  };

  return (
    <>
    {alertVisible && (
        <AutoAlert
          duration={3000} // Alert will close after 3 seconds
          onClose={handleCloseAlert}
        />
      )}
    <div className="flex justify-center items-center w-screen h-screen">
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <br />
        <input
          type="text"
          name="username"
          className="border-[1px] border-black w-[200px] h-[30px] p-3"
          value={data.username}
          onChange={handleChange}
        />
        <br />
        {errors.username && <div className="text-red-500">{errors.username}</div>}

        <label htmlFor="email">Email</label>
        <br />
        <input
          type="email"
          name="email"
          className="border-[1px] border-black w-[200px] h-[30px] p-3"
          value={data.email}
          onChange={handleChange}
        />
        <br />
        {errors.email && <div className="text-red-500">{errors.email}</div>}

        <label htmlFor="phonenumber">Phone Number</label>
        <br />
        <input
          type="text"
          name="phonenumber"
          className="border-[1px] border-black w-[200px] h-[30px] p-3"
          value={data.phonenumber}
          onChange={handleChange}
        />
        <br />
        {errors.phonenumber && <div className="text-red-500">{errors.phonenumber}</div>}

        <label htmlFor="message">Message</label>
        <br />
        <textarea
          name="message"
          className="border-[1px] border-black w-[200px] p-3"
          value={data.message}
          onChange={handleChange}
        ></textarea>
        <br />
        {errors.message && <div className="text-red-500">{errors.message}</div>}

        <button type="submit" className="p-4 bg-yellow-300">Send</button>
      </form>
    </div>
    </>   
  );
}
