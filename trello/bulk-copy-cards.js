const boardId = window.location.pathname.match(/(?<=\/b\/).*?(?=\/)/)[0];
const dsc = (await cookieStore.get("dsc")).value;
const dryRun = true;

const target = {
  boardId: "Bn4rRI6Z",
  mapList: {
    // source -> target (Optional, default is the same list name)
    // "Backlog": "Backlog",
  },
};

/**
 * Fetches a Trello board and its associated data.
 *
 * @param {string} boardId - The ID of the Trello board to fetch.
 /**
 * @returns {Promise<{
 *   id: string,
 *   cards: Array<{
 *     id: string,
 *     address: *,
 *     badges: {
 *       attachments: number,
 *       fogbugz: string,
 *       checkItems: number,
 *       checkItemsChecked: number,
 *       checkItemsEarliestDue: *,
 *       comments: number,
 *       description: boolean,
 *       due?: string,
 *       dueComplete: boolean,
 *       lastUpdatedByAi: boolean,
 *       start: *,
 *       externalSource: *,
 *       attachmentsByType: {
 *         trello: {
 *           board: number,
 *           card: number
 *         }
 *       },
 *       location: boolean,
 *       votes: number,
 *       maliciousAttachments: number,
 *       viewingMemberVoted: boolean,
 *       subscribed: boolean
 *     },
 *     cardRole: *,
 *     closed: boolean,
 *     coordinates: *,
 *     cover: {
 *       idAttachment: *,
 *       color: *,
 *       idUploadedBackground: *,
 *       size: string,
 *       brightness: string,
 *       idPlugin: *
 *     },
 *     creationMethod: *,
 *     creationMethodError: *,
 *     creationMethodLoadingStartedAt: *,
 *     dateLastActivity: string,
 *     desc: string,
 *     descData: {
 *       emoji: {}
 *     },
 *     due?: string,
 *     dueComplete: boolean,
 *     dueReminder?: number,
 *     idAttachmentCover: *,
 *     idBoard: string,
 *     idLabels: Array<string>,
 *     idList: string,
 *     idMembers: Array<*>,
 *     idShort: number,
 *     isTemplate: boolean,
 *     labels: Array<{
 *       id: string,
 *       idBoard: string,
 *       idOrganization: string,
 *       name: string,
 *       nodeId: string,
 *       color: string,
 *       uses: number
 *     }>,
 *     limits: {
 *       attachments: {
 *         perCard: {
 *           status: string,
 *           disableAt: number,
 *           warnAt: number
 *         }
 *       },
 *       checklists: {
 *         perCard: {
 *           status: string,
 *           disableAt: number,
 *           warnAt: number
 *         }
 *       },
 *       stickers: {
 *         perCard: {
 *           status: string,
 *           disableAt: number,
 *           warnAt: number
 *         }
 *       }
 *     },
 *     locationName: *,
 *     mirrorSourceId: *,
 *     name: string,
 *     nodeId: string,
 *     pinned: boolean,
 *     pos: number,
 *     shortLink: string,
 *     shortUrl: string,
 *     start: *,
 *     subscribed: boolean,
 *     url: string,
 *     stickers: Array<*>,
 *     attachments: Array<{
 *       id: string,
 *       bytes?: number,
 *       date: string,
 *       edgeColor: *,
 *       fileName: string,
 *       idMember: string,
 *       isMalicious: boolean,
 *       isUpload: boolean,
 *       mimeType: string,
 *       name: string,
 *       pos: number,
 *       url: string
 *     }>,
 *     checklists: Array<{
 *       id: string,
 *       idBoard: string,
 *       idCard: string,
 *       name: string,
 *       pos: number
 *     }>,
 *     pluginData: Array<*>,
 *     customFieldItems: Array<*>
 *   }>,
 *   labels: Array<{
 *     id: string,
 *     idBoard: string,
 *     name: string,
 *     color: string,
 *     uses: number
 *   }>,
 *   lists: Array<{
 *     id: string,
 *     closed: boolean,
 *     color: *,
 *     creationMethod: *,
 *     datasource: {
 *       filter: boolean
 *     },
 *     idBoard: string,
 *     limits: {
 *       cards: {
 *         openPerList: {
 *           status: string,
 *           disableAt: number,
 *           warnAt: number
 *         },
 *         totalPerList: {
 *           status: string,
 *           disableAt: number,
 *           warnAt: number
 *         }
 *       }
 *     },
 *     name: string,
 *     nodeId: string,
 *     pos: number,
 *     softLimit: *,
 *     subscribed: boolean,
 *     type: *
 *   }>
 * }>}
 */
const getBoard = async (boardId) => {
  const response = await fetch(
    `https://trello.com/1/board/${boardId}?fields=id&cards=visible&card_fields=id%2ClabelNames%2Caddress%2Cbadges%2CcardRole%2Cclosed%2Ccoordinates%2Ccover%2CcreationMethod%2CcreationMethodError%2CcreationMethodLoadingStartedAt%2CdateLastActivity%2Cdesc%2CdescData%2Cdue%2CdueComplete%2CdueReminder%2CidAttachmentCover%2CidBoard%2CidLabels%2CidList%2CidMembers%2CidShort%2CisTemplate%2Clabels%2Climits%2ClocationName%2CmirrorSourceId%2Cname%2CnodeId%2Cpinned%2Cpos%2CshortLink%2CshortUrl%2Cstart%2Csubscribed%2Curl&card_attachments=true&card_attachment_fields=id%2Cbytes%2Cdate%2CedgeColor%2CfileName%2CidMember%2CisMalicious%2CisUpload%2CmimeType%2Cname%2Cpos%2Curl&card_checklists=all&card_checklist_fields=id%2CidBoard%2CidCard%2Cname%2Cpos&card_checklist_checkItems=none&card_customFieldItems=true&card_pluginData=true&card_stickers=true&labels=all&lists=open&list_fields=id%2Cclosed%2Ccolor%2CcreationMethod%2Cdatasource%2CidBoard%2Climits%2Cname%2CnodeId%2Cpos%2CsoftLimit%2Csubscribed%2Ctype`
  );
  const data = await response.json();
  return data;
};

const sourceBoard = await getBoard(boardId);
const targetBoard = await getBoard(target.boardId);

for (const c of sourceBoard.cards) {
  const cardId = c.id;
  const cardList = sourceBoard.lists.find((l) => l.id === c.idList);

  const targetList = targetBoard.lists.find(
    (l) => l.name === (target.mapList[cardList.name] || cardList.name)
  );

  if (!targetList) {
    console.log(`List ${cardList.name} not found in target board`);
    continue;
  }

  if (dryRun) {
    console.log(`Dry run: ${c.name} | ${cardList.name} -> ${targetList.name}`);
    continue;
  }

  const response = await fetch("https://trello.com/1/cards", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      dsc,
      idCardSource: cardId,
      idList: targetList.id,
      name: c.name,
      keepFromSource: "start,due,dueReminder,labels",
    }),
  });

  console.log(
    `Created Card ${cardId} | ${c.name} | ${targetList.name}`,
    await response.json()
  );
}

console.log("Done");
