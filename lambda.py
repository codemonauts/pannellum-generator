import json
from boto3.dynamodb.types import TypeDeserializer, TypeSerializer
import boto3
import decimal


class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return float(obj)
        # Let the base class default method raise the TypeError
        return json.JSONEncoder.default(self, obj)


def dynamo_to_dict(item):
    print(item)


def dict_to_dynamo(item):
    serializer = TypeSerializer()
    return {k: serializer.serialize(v) for k, v in item.items()}


def lambda_handler(event, context):
    http_method = event.get("requestContext").get("http").get("method")
    client = boto3.resource("dynamodb")
    table = client.Table("pannellum")
    cors = {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    }

    if http_method == "GET":
        response = table.scan()
        hotspots = {}
        for item in response.get("Items", []):
            scene = item.pop("scene")
            if not scene in hotspots:
                hotspots[scene] = []
            hotspots[scene].append(item)

        return {
            "statusCode": 201,
            "headers": cors,
            "contentType": "application/json",
            "body": json.dumps(hotspots, cls=DecimalEncoder),
        }
    elif http_method == "POST":
        print(event.get("body"))
        item = json.loads(event.get("body"), parse_float=decimal.Decimal)
        print(dict_to_dynamo(item))
        response = table.put_item(Item=item)
        return {
            "statusCode": 201,
            "headers": cors,
            "body": json.dumps(response),
        }
    elif http_method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": cors,
        }
    else:
        return {
            "statusCode": 501,
        }
