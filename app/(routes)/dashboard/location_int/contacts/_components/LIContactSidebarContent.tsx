import { Icon } from "@iconify/react";
import {
  Avatar,
  Card,
  CardHeader,
  Divider,
  FormControl,
  Select,
  Tab,
  Tabs,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/app/lib/tailwindLib";
import AppInput from "@/app/_components/AppInput";
// import { AppInput } from '';

export const LIContactSidebarContent = () => {
  const [tabValue, setTabValue] = useState("one");
  const [selectValue, setSelectValue] = useState("");

  const [toggleHeart, setToggleHeart] = useState(false);
  const [isHeartHover, setisHeartHover] = useState(false);
  const [toggleLikeIcon, settoggleLikeIcon] = useState(false);
  const [toggleDislikeIcon, setToggleDislikeIcon] = useState(false);

  const heartIcon =
    isHeartHover || toggleHeart ? "si:heart-fill" : "si:heart-line";

  const handleToggleHeart = () => {
    setToggleHeart((prev) => {
      if (prev === true) {
        toast.success("Contact removed successfully!", {
          position: "top-right",
          duration: 2000,
        });
      } else {
        toast.success("Contact saved successfully!", {
          position: "top-right",
          duration: 2000,
        });
      }
      return !prev;
    });
  };

  const likeIcon = toggleLikeIcon ? "mdi:like" : "mdi:like-outline";
  const dislikeIcon = toggleDislikeIcon ? "mdi:dislike" : "mdi:dislike-outline";

  type ICardItem = {
    icon: string;
    title: string;
    action: string[];
  };

  const cardItems: ICardItem[] = [
    {
      icon: "gg:pin",
      title: "Location Intelligence",
      action: [likeIcon, dislikeIcon],
    },
    {
      icon: "hugeicons:internet",
      title: "www.trinitygroup.com",
      action: [likeIcon, dislikeIcon],
    },
    {
      icon: "clarity:users-line",
      title: "2-11 Employees",
      action: [likeIcon, dislikeIcon],
    },
    {
      icon: "ph:building-light",
      title: "Energy",
      action: [likeIcon, dislikeIcon],
    },
    {
      icon: "ant-design:calendar-outlined",
      title: "2002",
      action: [likeIcon, dislikeIcon],
    },
  ];

  return (
    <>
      <AppInput
        type="text"
        id=""
        onChange={() => console.log("")}
        placeholder="Enter location"
        style={{
          background: "white",
          width: "100%",
          zIndex: 10,
          borderRadius: "0 !important",
        }}
        className="!rounded-none "
        startAdornment={
          <Icon icon="ph:map-pin-light" className="mr-2 size-5" />
        }
      />
      <FormControl fullWidth>
        {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
        <Select
          displayEmpty
          // labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectValue}
          size="small"
          className="!rounded-none "
          onChange={(e) => setSelectValue(e.target.value)}
        ></Select>
      </FormControl>
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        textColor="primary"
        indicatorColor="primary"
        aria-label="secondary tabs example"
        className="mx-auto"
      >
        <Tab value="one" label="Person" />
        <Tab value="two" label="Enterprise" />
        {/* <Tab value="three" label="Item Three" /> */}
      </Tabs>
      <div className="flex flex-col w-full gap-4 ">
        {Array.from({ length: 10 }).map((_, index) => (
          <Card key={index} className="border !shadow-none !rounded-none">
            <CardHeader
              avatar={<Avatar className="!rounded-md">T</Avatar>}
              title={
                <span className="text-xs font-bold">Motankeng Stephenson </span>
              }
              subheader={<span className="text-xs">Founder and CEO</span>}
              action={
                <div className="h-[3rem]  flex items-center gap-3">
                  <Icon
                    icon={heartIcon}
                    className="size-4 text-primary-600 hover:text-primary-600/50 cursor-pointer"
                    onMouseEnter={() => setisHeartHover(true)}
                    onMouseLeave={() => setisHeartHover(false)}
                    onClick={() => handleToggleHeart()}
                  />
                  <button className="p-0 text-xs px-2 border-secondary-500 hover:bg-secondary-100 text-secondary-500 bg-secondary-50 rounded-none">
                    Save contact
                  </button>
                </div>
              }
              // className="!gap-1"
            />
            <Divider variant="middle" component="div" />
            <div className="flex flex-col w-full">
              {cardItems.map((item: ICardItem, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-2 "
                >
                  <div className="flex items-center gap-2">
                    <Icon icon={item.icon} className="size-4 text-gray-400" />
                    <span
                      className={cn(
                        "text-base",
                        index === 2 && "text-blue-500"
                      )}
                    >
                      {item.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.action.map((actionIcon, idx) => (
                      <Icon
                        key={idx}
                        icon={actionIcon}
                        className="size-3 cursor-pointer text-blue-500"
                        onClick={() => {
                          if (actionIcon === likeIcon) {
                            settoggleLikeIcon(!toggleLikeIcon);
                          } else if (actionIcon === dislikeIcon) {
                            setToggleDislikeIcon(!toggleDislikeIcon);
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};
