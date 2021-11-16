import React, { useEffect, useRef } from "react";

import { request, gql } from "graphql-request";
import useSWR from "swr";
import TimeAgo from "timeago-react";

type Message = {
  txHash: string;
  created: number;
  channel: "CORRUPTION" | "REFLECTION";
  message: string;
};

const GRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/cjpais/corruption-messaging";

const query = gql`
  {
    messages(first: 500, orderBy: created, orderDirection: desc) {
      id
      created
      channel
      message
    }
  }
`;

const IndexPage = () => {
  // const ref = useRef<HTMLDivElement>(null);
  const { data } = useSWR(["message-fetch"], () => request(GRAPH_URL, query), {
    revalidateOnMount: true,
  });

  // useEffect(() => {
  //   ref.current?.scrollIntoView();
  // }, [data]);

  return (
    <div className="index">
      <div>
        <h1>Corruption Messaging</h1>
      </div>
      {data?.messages?.reverse().map((msg: Message) => (
        <div className="message-container">
          <div className="message-header">
            <div
              className="message-channel"
              style={{
                backgroundColor:
                  msg.channel == "CORRUPTION" ? "#A802B7" : "#57fd48",
              }}
            >
              {msg.channel}
            </div>

            <div>-</div>
            <TimeAgo datetime={new Date(msg.created * 1000)} />
          </div>
          <div>{msg.message}</div>
        </div>
      ))}
      {/* <div ref={ref} className="bottom" /> */}
      <style jsx>{`
        .index {
          margin: 0 auto;
          margin-top: 3rem;
          max-width: 40rem;
          overflow-wrap: break-word;
        }

        .message-container {
          margin-bottom: 2rem;
        }

        .message-header {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .message-channel {
          font-weight: bold;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          color: black;
        }
      `}</style>
    </div>
  );
};

export default IndexPage;
