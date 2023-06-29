import { AnimateContainer } from "../../components/animation";
import { fadeIn } from "../../components/animation/animation";
import ProfileInfo from "./ProfileInfo";
import AccountDetails from "./AccountDetails";

export const Profile = (props: any) => [
  {
    label: `Doctor Information`,
    key: "1",
    children: (
      <AnimateContainer
        variants={fadeIn}
        key={1}
        className="flex flex-col flex-auto"
      >
        <ProfileInfo {...props} />
      </AnimateContainer>
    ),
  },
  {
    label: `Account Details`,
    key: "2",
    children: (
      <AnimateContainer
        variants={fadeIn}
        key={2}
        className="flex flex-col flex-auto"
      >
        <AccountDetails {...props} />
      </AnimateContainer>
    ),
  },
];

export default Profile;
