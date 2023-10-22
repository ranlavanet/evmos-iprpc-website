import Image from "next/image";
import Container from "./container";
import heroImg from "../public/img/test1.png";
import Link from "next/link";
import FileInputComponent from "./fileInput";
import React, { useState } from 'react';
import ParsedDataComponent from "./parsedJsonData"

const Hero = () => {
  const [uploadedData, setUploadedData] = useState(null);
  const handleFileUpload = (data) => {
    setUploadedData(data);
  };

  return (
    <>
      <Container className="flex flex-wrap">
        <div className="flex items-center w-full lg:w-1/2">
          <div className="max-w-2xl mb-8">
            <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row" style={{ margin: '20px' }}>
              <div className="rounded-lg p-4 border border-gray-300" >
                <FileInputComponent onFileUpload={handleFileUpload}/>
              </div>
              {uploadedData ? (
                // <UploadedComponent data={uploadedData} />
                <Link href="/" className="px-6 py-2 text-white bg-green-400 rounded-md md:ml-5">
                  Launch Transaction
                </Link>
              ) : (
                <Link href="/" className="px-6 py-2 text-white bg-gray-400 rounded-md md:ml-5">
                  Launch Transaction
                </Link>
              )}
              
            </div>
            {uploadedData ? (
              <ParsedDataComponent data={uploadedData} /> // Use the component to showcase the parsed data
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex items-center justify-center w-full lg:w-1/2">
          <div className="">
            <Image
              src={heroImg}
              width="616"
              height="617"
              className={"object-cover"}
              alt="Hero Illustration"
              loading="eager"
              placeholder="blur"
            />
          </div>
        </div>
      </Container>
      <Container>
        <div className="flex flex-col justify-center">
          <div className="text-xl text-center text-gray-700 dark:text-white"></div>
        </div>
      </Container>
    </>
  );
}

export default Hero;
