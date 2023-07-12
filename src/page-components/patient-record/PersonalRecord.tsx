import React from "react";
import { Checkbox } from "antd";
import Image from "next/image";
import { AiOutlineSearch } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import Avatar from "@components/Avatar";
import { Button } from "@components/Button";
import Card from "@components/Card";
import Input from "@components/Input";
import { Select } from "@components/Select";


export function PersonalRecord({ patientRecord }: any) {
  let [search, setSearch] = React.useState("");
  return (
    <div className="space-y-8">
      <div className="space-y-4 pt-4">
        <h4>Share Patient Record</h4>
        <Input
          placeholder="Search"
          prefix={<AiOutlineSearch className="text-lg text-casper-500" />}
          className="rounded-full text-base shadow-none"
          onChange={(e: any) => setSearch(e.target.value)}
        />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((row, index) => {
          return (
            <Card key={index}>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_25%_35%] divided-border">
                <div className="flex justify-center items-center flex-wrap xs:flex-nowrap gap-4">
                  <Avatar className="h-20 w-20">
                    <Image
                      src={`https://picsum.photos/${500 + index}/${500 +
                        index}`}
                      alt="random pics"
                      fill
                      sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                      className="object-center rounded-full"
                    />
                  </Avatar>
                  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-[auto_1fr] xs:gap-2 basis-full xs:basis-auto">
                    <div className="after:content-none xs:after:content-[':'] after:pl-2 after:float-right text-gray-400 xs:text-left text-center">
                      Name
                    </div>
                    <div className="font-medium xs:text-left text-center xs:mb-0 mb-4">
                      Dr.Steven Gan
                    </div>
                    <div className="after:content-none xs:after:content-[':'] after:pl-2 after:float-right text-gray-400 xs:text-left text-center">
                      Clinic Name
                    </div>
                    <div className="font-medium xs:text-left text-center xs:mb-0 mb-4">
                      GAOC
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center gap-4 font-medium">
                  <Select placeholder="Select">
                    <Select.Option value="yes">Yes</Select.Option>
                    <Select.Option value="no">No</Select.Option>
                  </Select>
                </div>
                <Checkbox.Group className="grid grid-cols-2 font-medium text-base gap-2">
                  <Checkbox value="1">Personal Info</Checkbox>
                  <Checkbox value="2">Charting</Checkbox>
                  <Checkbox value="3">Dental History</Checkbox>
                  <Checkbox value="4">Treatment Records</Checkbox>
                  <Checkbox value="5">Medical History</Checkbox>
                  <Checkbox value="6">Medical Gallery</Checkbox>
                  <Checkbox value="7">Treatment Plan</Checkbox>
                  <Checkbox value="8">Prescription</Checkbox>
                </Checkbox.Group>
              </div>
              <Button
                appearance="link"
                className="absolute top-0 right-0 m-4 text-2xl"
              >
                <BsTrash />
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default PersonalRecord;
