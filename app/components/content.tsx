import { useState, useEffect } from "react";
import { Box, Avatar, Text } from "@primer/react";
import { SkeletonAvatar } from "@primer/react/drafts";
import ReactMarkdown from "react-markdown";
import { Issue } from "../page";
import { fetchIssueSummary, fetchAvatarUrl } from "../client";

const Content = ({ issue }: { issue: Issue }) => {
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarLoading, setAvatarLoading] = useState<boolean>(true);
  const [issueSummary, setIssueSummary] = useState<string>("");

  useEffect(() => {
    const fetchAvatar = async () => {
      if (issue?.user) {
        setAvatarLoading(true);
        const url = await fetchAvatarUrl(issue.user.login);
        setAvatarUrl(url);
        setAvatarLoading(false);
      }
    };

    fetchAvatar();
  }, [issue]);

  useEffect(() => {
    const fetchSummary = async () => {
      const summary = await fetchIssueSummary(issue.body || "");
      setIssueSummary(summary);
    };

    fetchSummary();
  }, [issue]);

  if (!issue) return null;

  return (
    <Box sx={{ maxWidth: "800px", width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          p: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          borderBottom: "1px solid",
          borderColor: "border.default",
          width: "100%",
        }}
      >
        <Text as="h2" sx={{ fontWeight: "normal", fontSize: "32px", mb: "0" }}>
          {issue.title}
        </Text>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "8px",
            width: "100%",
          }}
        >
          {avatarLoading ? (
            <SkeletonAvatar size={20} square={false} />
          ) : (
            <Avatar src={avatarUrl} />
          )}
          <Text as="p" sx={{ fontWeight: "bold", fontSize: 1, m: "0" }}>
            {issue.user ? issue.user.login : "Unknown"}
          </Text>
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ p: "16px" }}>
        <ReactMarkdown>{issueSummary}</ReactMarkdown>
      </Box>
    </Box>
  );
};

export const ContentArea = ({
  currentItem,
  issues,
}: {
  currentItem: number;
  issues: Issue[];
}) => {
  const selectedIssue = issues[currentItem];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflowY: "auto",
        alignItems: "center",
      }}
    >
      <Content issue={selectedIssue} />
    </Box>
  );
};