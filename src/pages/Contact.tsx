import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types/json";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const inquiryType = formData.get('type') as string;
    const messageContent = formData.get('message') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    const messageData = {
      title: `${inquiryType} Inquiry`,
      message: messageContent,
      user_id: user?.id || null,
      type: 'contact',
      data: {
        name,
        email,
        inquiry_type: inquiryType
      } as unknown as Json,
      read: false
    };

    try {
      const { error } = await supabase
        .from('notifications')
        .insert(messageData);

      if (error) throw error;

      toast({
        title: "Message sent successfully",
        description: "We'll get back to you as soon as possible.",
      });
      
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
      
      <Tabs defaultValue="support" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="support">User Support</TabsTrigger>
          <TabsTrigger value="business">Business Inquiries</TabsTrigger>
        </TabsList>

        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle>User Support</CardTitle>
              <CardDescription>
                Need help with your account or have questions about our service? We're here to help!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="hidden" name="type" value="support" />
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" required className="min-h-[150px]" />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Inquiries</CardTitle>
              <CardDescription>
                Interested in partnering with us or have a business proposal? Let's talk!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="hidden" name="type" value="business" />
                <div className="space-y-2">
                  <Label htmlFor="business-name">Name</Label>
                  <Input id="business-name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-email">Email</Label>
                  <Input id="business-email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-message">Message</Label>
                  <Textarea id="business-message" name="message" required className="min-h-[150px]" />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}