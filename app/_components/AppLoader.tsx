import HashLoader from "react-spinners/HashLoader";

interface AppLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  color?: string;
}

export const AppLoader: React.FC<AppLoaderProps> = ({
  size = 35,
  ...props
}) => {
  return (
    <HashLoader
      size={size}
      className="text-primary-500 fill-primary-500"
      {...props}
    />
  );
};

export default AppLoader;
