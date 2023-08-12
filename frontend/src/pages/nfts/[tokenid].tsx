import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Image,
  Link,
  Table,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { FC } from "react";
import { ShareButtons } from "src/components/atoms/nft/ShareButtons";
import {
  getEventGroups,
  getNFTDataFromTokenID,
  getOwnerOfTokenId,
} from "src/libs/contractMethods";
import { NFT } from "types/NFT";
import { ipfs2http } from "utils/ipfs2http";

type Props = {
  address?: string;
  tokenid?: string;
  nft?: NFT.Metadata | null;
  groupName?: string;
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const address = context.query.address;
  const props: Props = {
    address: String(address),
  };
  if (context.query.tokenid) {
    try {
      props.tokenid = String(context.query.tokenid);
      const data = await getNFTDataFromTokenID(BigNumber.from(props.tokenid));
      if (data) {
        props.nft = data;
      }
      const owner = await getOwnerOfTokenId(BigNumber.from(props.tokenid));
      if (owner) {
        props.address = owner;
      }
      const groups = await getEventGroups();
      if (groups) {
        const gid = BigNumber.from(props.nft?.traits.EventGroupId);
        props.groupName = groups.find((group) => gid.eq(group.groupId))?.name;
      }
    } catch (e) {
      console.log(e);
      return {
        notFound: true,
      };
    }
    console.log(props);
  }
  return {
    props: props,
  };
};

const Entity: FC<Props> = (props: Props) => {
  return (
    <Container maxW="1000">
      {props.nft && (
        <NextSeo
          title={`${props.nft.name} | MintRally`}
          description={props.nft.description}
          openGraph={{
            url: `https://mintrally.xyz/nfts/${props.tokenid}`,
            images: [
              {
                url: ipfs2http(props.nft.image),
                width: 600,
                height: 600,
                alt: props.nft.name,
              },
            ],
          }}
        ></NextSeo>
      )}
      <Box mt={10}>
        <Heading as="h1" size="xl" color="mint.primary" fontWeight={700}>
          NFT
        </Heading>
        {props.nft && (
          <>
            <Flex
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              p={4}
            >
              <Table maxWidth="100%" variant="simple">
                <Tbody>
                  <Tr>
                    <Th>Owner: </Th>
                    <Td overflowWrap="anywhere" whiteSpace="unset">
                      {props.address}
                    </Td>
                  </Tr>
                  <Tr>
                    <Th>Event: </Th>
                    <Td overflowWrap="anywhere">
                      <Link
                        href={`/event-groups/${props.nft.traits.EventGroupId}`}
                      >
                        {props.groupName} (
                        {props.nft.traits.RequiredParticipateCount + 1} 回目)
                      </Link>
                    </Td>
                  </Tr>
                  <Tr>
                    <Th>Name:</Th>
                    <Td overflowWrap="anywhere"> {props.nft.name}</Td>
                  </Tr>
                  <Tr>
                    <Th>Description:</Th>
                    <Td overflowWrap="anywhere">
                      {" "}
                      {props.nft.description}aabbbbbbbababafgaertaeravasereba
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
              <Box>
                <Image src={ipfs2http(props.nft.image)} alt={props.nft.name} />
              </Box>
              <Box width={"95%"} p={4}>
                <ShareButtons
                  tokenId={Number(props.tokenid)}
                  address={props.address!}
                  twitter={true}
                />
              </Box>
            </Flex>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Entity;
