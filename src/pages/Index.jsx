import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Configuration, OpenAIApi } from "openai";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signIn({ email, password });
    if (error) {
      toast.error("Login failed: " + error.message);
    } else {
      setIsAuthenticated(true);
      toast.success("Login successful!");
    }
  };

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast.error("Registration failed: " + error.message);
    } else {
      setIsAuthenticated(true);
      toast.success("Registration successful!");
    }
  };

  const handleSendMessage = async () => {
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      });
      setResponse(completion.data.choices[0].message.content);
    } catch (error) {
      toast.error("Failed to get response: " + error.message);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      {!isAuthenticated ? (
        <Card className="w-full max-w-md p-4">
          <CardHeader>
            <CardTitle>Login / Register</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleLogin}>Login</Button>
              <Button variant="outline" onClick={handleRegister}>
                Register
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md p-4">
          <CardHeader>
            <CardTitle>AI Therapist Chatbot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="message">Your Message</Label>
              <Input
                id="message"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button onClick={handleSendMessage}>Send</Button>
            {response && (
              <div className="mt-4 p-2 border rounded">
                <strong>Response:</strong>
                <p>{response}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;