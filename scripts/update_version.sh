FILE=$1

REPLACED=$(sed "s/frontend: '.*'/frontend: '$2'/" $FILE)

echo "$REPLACED" > $FILE