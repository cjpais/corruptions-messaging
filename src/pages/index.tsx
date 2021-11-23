import React, { useEffect } from "react";

import { request, gql } from "graphql-request";
import useSWR from "swr";
import TimeAgo from "timeago-react";
import { Message } from "../app/components/Message";

type Message = {
  id: string; // this is the tx hash
  createdAt: number;
  channel: "CORRUPTION" | "REFLECTION";
  message: string;
};

const GRAPH_URL = "https://api.thegraph.com/subgraphs/name/shahruz/corruptions";

const query = gql`
  {
    messages(first: 500, orderBy: createdAt, orderDirection: desc) {
      id
      createdAt
      channel
      message
    }
  }
`;

const IndexPage = () => {
  const { data, error } = useSWR(
    ["message-fetch"],
    () => request(GRAPH_URL, query),
    {
      revalidateOnMount: true
    }
  );

  console.log({ data, error });

  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "desc"
  );
  const [messages, setMessages] = React.useState<Message[] | null>(null);

  useEffect(() => {
    if (data) {
      setMessages((data.messages as Message[]).reverse());
    }
  }, [data, sortDirection]);

  return (
    <div className="index">
      <div>
        <h1>Corruption Messaging</h1>
        <button
          onClick={() => {
            sortDirection == "asc"
              ? setSortDirection("desc")
              : setSortDirection("asc");
          }}
        >
          sort: {sortDirection}
        </button>
      </div>
      {messages?.reverse().map((msg: Message) => (
        <div className="message-container" key={msg.id}>
          <div className="message-header">
            <div
              className="message-channel"
              style={{
                backgroundColor:
                  msg.channel == "CORRUPTION"
                    ? "#A802B7"
                    : "REFLECTIONS"
                    ? "#57fd48"
                    : "#ff0000"
              }}
            >
              {msg.channel}
            </div>

            <div>-</div>
            <TimeAgo datetime={new Date(msg.createdAt * 1000)} />
            <div>-</div>
            <a href={`https://etherscan.io/tx/${msg.id}`}>tx ↗</a>
          </div>
          <div></div>
          <Message contents={msg.message} />
        </div>
      ))}
      <style jsx>{`
        .index {
          margin: 0 auto;
          margin-top: 3rem;
          max-width: 40rem;
          overflow-wrap: break-word;
        }

        @media screen and (max-width: 768px) {
          .index {
            padding: 1.5rem;
            margin-top: 0;
          }
        }

        h1 {
          margin: 2rem 0;
        }

        button {
          font-weight: 700;
          font-size: 0.8rem;
          font-style: italic;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          color: white;
          background-color: #333;
          border: none;
          margin-bottom: 1.5rem;
          padding: 0.25rem 0.5rem;
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
