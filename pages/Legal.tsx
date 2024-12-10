import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Legal() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Legal Information</h1>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Terms of Service</CardTitle>
            <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">1. Acceptance of Terms</h3>
                <p>
                  By accessing and using this website, you accept and agree to be bound by the terms
                  and provision of this agreement.
                </p>

                <h3 className="text-lg font-semibold">2. User Accounts</h3>
                <p>
                  Some features of the website require an account. You are responsible for maintaining
                  the confidentiality of your account.
                </p>

                <h3 className="text-lg font-semibold">3. Premium Subscription</h3>
                <p>
                  Premium features are available to subscribed users. Subscription fees are non-refundable
                  except where required by law.
                </p>

                <h3 className="text-lg font-semibold">4. Content</h3>
                <p>
                  Users may submit recipes and other content. You retain ownership of your content but
                  grant us a license to use it on the platform.
                </p>

                <h3 className="text-lg font-semibold">5. Privacy</h3>
                <p>
                  Your privacy is important to us. Please review our Privacy Policy to understand how
                  we collect and use your information.
                </p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
            <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">1. Information We Collect</h3>
                <p>
                  We collect information you provide directly to us, including but not limited to your
                  name, email address, and any content you submit to the platform.
                </p>

                <h3 className="text-lg font-semibold">2. How We Use Your Information</h3>
                <p>
                  We use the information we collect to provide, maintain, and improve our services,
                  to communicate with you, and to personalize your experience.
                </p>

                <h3 className="text-lg font-semibold">3. Information Sharing</h3>
                <p>
                  We do not sell your personal information. We may share your information with third
                  parties only as described in this policy.
                </p>

                <h3 className="text-lg font-semibold">4. Data Security</h3>
                <p>
                  We implement appropriate security measures to protect your personal information
                  against unauthorized access and disclosure.
                </p>

                <h3 className="text-lg font-semibold">5. Your Rights</h3>
                <p>
                  You have the right to access, correct, or delete your personal information. Contact
                  us through our support channels to exercise these rights.
                </p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}