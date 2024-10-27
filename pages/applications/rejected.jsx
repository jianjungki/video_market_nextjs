import useFetch from "@/components/hooks/useFetch";
import prisma from "@/utils/prisma";
import {
  Button,
  IndexTable,
  Layout,
  Card,
  Modal,
  Page,
  Text,
  useIndexResourceState,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

const ApplicationsRejected = (props) => {
  const [pending, setPending] = useState(props.pending);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const fetch = useFetch();
  const [active, setActive] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);

  async function updateApplications() {
    const response = await (
      await fetch("/api/apps/application/fetch/rejected")
    ).json();
    setPending(response);
  }

  const handleModalOpen = (application) => {
    setCurrentApplication(application);
    setActive(true);
  };

  const handleModalClose = useCallback(() => {
    setActive(false);
    setCurrentApplication(null);
  }, []);

  const resourceName = {
    singular: "application",
    plural: "applications",
  };

  const { selectedResources, handleSelectionChange } =
    useIndexResourceState(pending);

  const rowMarkup = pending.map((values, index) => (
    <>
      <IndexTable.Row
        id={values.id}
        key={values.id}
        selected={selectedResources.includes(values.id)}
        position={index}
      >
        <IndexTable.Cell>{values.name}</IndexTable.Cell>
        <IndexTable.Cell>{values.email}</IndexTable.Cell>
        <IndexTable.Cell>
          <Button onClick={() => handleModalOpen(values)} variant="primary">
            View
          </Button>
        </IndexTable.Cell>
      </IndexTable.Row>
    </>
  ));

  const modalMarkup = currentApplication && (
    <Modal
      open={active}
      onClose={handleModalClose}
      title={`${currentApplication.name}'s Application`}
      primaryAction={{
        content: "View In Admin",
        onAction: async () => {
          open(
            `shopify://admin/customers/${currentApplication.customer_id}`,
            "_blank"
          );
        },
      }}
      secondaryActions={[
        {
          destructive: true,
          outline: true,
          loading: isLoading,
          content: "Approve",
          onAction: async () => {
            setIsLoading(true);
            const response = await fetch(
              "/api/apps/application/actions/approve",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...currentApplication,
                }),
              }
            );
            setIsLoading(false);
            if (!response.error) {
              handleModalClose();
              updateApplications();
            } else {
              alert("There was an error approving this user");
            }
          },
        },
      ]}
    >
      <Modal.Section>
        <Text>
          <Text>Name: {currentApplication.name}</Text>
          <Text>Email: {currentApplication.email}</Text>
          {Object.entries(currentApplication.fields).map(([key, value]) => (
            <Text key={key}>{`${key}: ${value}`}</Text>
          ))}
        </Text>
      </Modal.Section>
    </Modal>
  );

  return (
    <>
      <Page
        title="Rejected Applications"
        backAction={{
          content: "Applications",
          onAction: () => {
            router.push("/applications");
          },
        }}
      >
        <Layout>
          <Layout.Section>
            <Card padding="0">
              <IndexTable
                resourceName={resourceName}
                itemCount={pending.length}
                selectedItemsCount={selectedResources.length}
                onSelectionChange={handleSelectionChange}
                selectable={false}
                headings={[
                  { title: "Name" },
                  { title: "Email" },
                  { title: "" },
                ]}
              >
                {rowMarkup}
              </IndexTable>
              {modalMarkup}
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
};

export default ApplicationsRejected;

export const getServerSideProps = async () => {
  const pendingApplications = await prisma.applications.findMany({
    where: { application_status: "rejected" },
  });

  return {
    props: {
      pending: pendingApplications,
    },
  };
};
