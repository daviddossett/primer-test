import { useState } from "react";
import { Box, Button, SelectPanel } from "@primer/react";
import { TriangleDownIcon } from "@primer/octicons-react";
import style from "./repoHeader.module.css";
import { ItemInput } from "@primer/react/lib-esm/deprecated/ActionList/List";
import { Repo } from "@/app/page";

interface RepoHeaderProps {
  repos: Repo[];
  selectedRepo: Repo;
  onRepoSelected: (repo: Repo) => void;
  onNewIssue: () => void;
}

const RepoSelector = ({
  repos,
  selectedRepo,
  onRepoSelected,
}: {
  repos: Repo[];
  selectedRepo: Repo;
  onRepoSelected: (repo: Repo) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const items: ItemInput[] = repos.map((repo) => ({
    text: `${repo.owner}/${repo.name}`,
    id: repo.name,
  }));

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleSelectedChange = (selected: ItemInput | undefined) => {
    if (selected) {
      const selectedRepo = repos.find((repo) => repo.name === selected.id);
      if (selectedRepo) {
        onRepoSelected(selectedRepo);
      }
    }
  };

  return (
    <SelectPanel
      renderAnchor={({ children, "aria-labelledby": ariaLabelledBy, ...anchorProps }) => (
        <Button
          trailingAction={TriangleDownIcon}
          aria-labelledby={` ${ariaLabelledBy}`}
          {...anchorProps}
          onClick={() => setIsOpen(!isOpen)}
        >
          {children ?? selectedRepo.name}
        </Button>
      )}
      placeholderText="Pick a repo"
      open={isOpen}
      onOpenChange={handleOpenChange}
      items={items}
      overlayProps={{
        width: "small",
        height: "medium",
      }}
      onFilterChange={() => {}}
      selected={items.find((item) => item.id === selectedRepo.name)}
      onSelectedChange={handleSelectedChange}
    />
  );
};

export const RepoHeader = ({ repos, selectedRepo, onRepoSelected, onNewIssue }: RepoHeaderProps) => {
  return (
    <Box className={style.container}>
      <RepoSelector repos={repos} selectedRepo={selectedRepo} onRepoSelected={onRepoSelected} />
      <Button variant="primary" onClick={onNewIssue}>
        New issue
      </Button>
    </Box>
  );
};
