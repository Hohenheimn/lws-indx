import { Space, Button } from "antd";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PageContainer } from "../../components/animation";
import { fadeInUp } from "../../components/animation/animation";

function Restricted() {
  return (
    <PageContainer style={{ alignItems: "center", justifyContent: "center" }}>
      <Space
        className="content-container"
        align="center"
        size={20}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <motion.div variants={fadeInUp}>
          {/* <LazyImage
            src="/images/logo.png"
            containerStyle={{
              height: "6rem",
              width: "12rem",
            }}
          /> */}
        </motion.div>
        <Space
          direction="vertical"
          style={{ borderLeft: "1px solid #ccc", paddingLeft: "2rem" }}
          size={15}
        >
          <motion.div variants={fadeInUp}>
            <h3 style={{ margin: 0, lineHeight: 1 }}>Restricted Access</h3>
          </motion.div>
          <motion.div variants={fadeInUp}>
            Sorry, you are not allowed to access this page.
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Link href="/" passHref={true}>
              <Button type="primary" className="login-btn">
                Home
              </Button>
            </Link>
          </motion.div>
        </Space>
      </Space>
    </PageContainer>
  );
}

export default Restricted;
