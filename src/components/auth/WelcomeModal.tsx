
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>مرحباً بك في منصة التحليلات المتقدمة</DialogTitle>
          <DialogDescription>
            اكتشف قوة التحليلات الذكية والمراقبة المستمرة لما يهمك. سجل الآن للحصول على تجربة كاملة.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-center mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            متابعة التصفح
          </Button>
          <Button
            onClick={() => navigate("/login")}
            className="bg-green-600 hover:bg-green-700"
          >
            تسجيل الدخول
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
