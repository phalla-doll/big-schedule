import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/lib/global-interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthorContactInfoDialogProps {
    isOpen: boolean;
    author: User | undefined;
    onClose: () => void;
    onSave?: (author: User) => void;
}

export default function AuthorContactInfoDialog({ isOpen, onClose, author, onSave }: AuthorContactInfoDialogProps) {
    const [formData, setFormData] = useState<User>({
        name: '',
        email: '',
        phone: '',
        id: '',
        role: 'user',
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: author?.name || '',
                email: author?.email || '',
                phone: author?.phone || '',
                id: author?.id || '',
                role: author?.role || 'user',
            });
        }
    }, [author, isOpen]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [id]: value,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (onSave) {
            const userToSave: User = {
                ...(author || {}),
                ...formData,
            };
            onSave(userToSave);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>Agenda Owner Contact Information</DialogTitle>
                <DialogDescription>
                    A contact information of the agenda owner. If viewers want to get in touch with the owner.
                </DialogDescription>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 my-4"> {/* Added my-4 for spacing, original was mb-4 */}
                        <div className="">
                            <Label htmlFor="name" className="mb-1.5 text-sm text-muted-foreground">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="">
                            <Label htmlFor="email" className="mb-1.5 text-sm text-muted-foreground">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="">
                            <Label htmlFor="phone" className="mb-1.5 text-sm text-muted-foreground">
                                Phone
                            </Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            type="button" // Ensure this button doesn't submit the form
                        >
                            Close
                        </Button>
                        <Button
                            variant="default"
                            type="submit" // This button will submit the form
                        >
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
