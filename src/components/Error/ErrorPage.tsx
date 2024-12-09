import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ErrorButton from "./ErrorButton";

export default function ErrorPage({
  errorCode,
  errorMessage,
}: {
  errorCode: string;
  errorMessage: string;
}) {
  const code = errorCode || "500";
  const message = errorMessage || "An unexpected error occurred";

  return (
    <div className="flex items-center justify-center min-h-screen bg-rawmats-background-700">
      <Card className="w-full max-w-md border-rawmats-accent-300">
        <CardHeader className=" text-rawmats-primary-700">
          <CardTitle className="text-4xl font-bold text-center">
            Error {code}
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-6">
          <p className="text-center text-rawmats-text-500">{message}</p>
        </CardContent>
        <CardFooter className="flex justify-center mt-6">
          <ErrorButton />
        </CardFooter>
      </Card>
    </div>
  );
}
