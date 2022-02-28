export default (options: {
  fromDate?: Date;
  toDate?: Date;
  timeBuckets?: Date[];
}) => [
  {
    $lookup: {
      from: 'tickets',
      let: {
        ruleId: '$id',
      },
      pipeline: [
        {
          $unwind: {
            path: '$rules',
          },
        },
        {
          $match: {
            $expr: {
              $eq: ['$rules', '$$ruleId'],
            },
          },
        },
        {
          $match:
            options && (options.fromDate || options.toDate)
              ? {
                  creation_time: {
                    ...(options.fromDate
                      ? { $gte: options.fromDate.getTime() }
                      : {}),
                    ...(options.toDate
                      ? { $lte: options.toDate.getTime() }
                      : {}),
                  },
                }
              : {},
        },
        {
          $bucket: {
            groupBy: '$creation_time',
            boundaries:
              options && options.timeBuckets
                ? options.timeBuckets.map((bucket) => bucket.getTime())
                : [options.fromDate.getTime(), options.toDate.getTime()], // Should throw if buckets does not exists and no from and to are present.
            output: {
              tp: {
                $sum: {
                  $cond: {
                    if: {
                      $eq: ['$resolution', 'TP'],
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
              fp: {
                $sum: {
                  $cond: {
                    if: {
                      $eq: ['$resolution', 'FP'],
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
              numTickets: {
                $sum: 1,
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            numTickets: 1,
            resolutions: {
              tp: '$tp',
              fp: '$fp',
            },
          },
        },
      ],
      as: 'tickets',
    },
  },
  {
    $unwind: {
      path: '$tickets',
    },
  },
  {
    $group: {
      _id: {
        id: '$id',
        name: '$name',
      },
      numTickets: {
        $push: '$tickets.numTickets',
      },
      resolutions: {
        $push: '$tickets.resolutions',
      },
    },
  },
];
