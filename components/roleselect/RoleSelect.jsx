import React from "react";
import {RadioGroup, Radio, useRadio, VisuallyHidden, cn} from "@nextui-org/react";

export const CustomRadio = (props) => {
  const {
    Component,
    children,
    isSelected,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group inline-flex items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent",
        "max-w-[400px] cursor-pointer border-2 border-default rounded-lg gap-5 p-4",
        "data-[selected=true]:border-primary",
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className="text-small text-foreground opacity-70">{description}</span>
        )}
      </div>
    </Component>
  );
};

export default function RoleSelect({role,setRole}) {
  return (
    <RadioGroup className="grid items-center"  value={role} onValueChange={setRole}>
      <CustomRadio description="Receive promotions from stores and reserve queues through the system." value="user" value="user">
        Customer
      </CustomRadio>
      <CustomRadio description="Increase your restaurant's opportunities and grow with us." value="restaurant">
        Restaurant
      </CustomRadio>
    </RadioGroup>
  );
}
