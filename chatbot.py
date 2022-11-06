import sys
from datetime import datetime
from difflib import get_close_matches
import random


chatbot = 'Ávila'

# Closest word match function
def closeMatches(word,patterns):
    #if(any(word.lower() in s.lower() for s in patterns)):
    for p in patterns:
        if(p.lower()== word.lower()):
           return p
    try:
        sw=get_close_matches(word, patterns, n=1)[0]
        write_to_text.write(chatbot + ": Do you mean "+ str(sw) +" ?[Yes/No]" + " \n ")
        print("Do you mean "+ str(sw) +" ?[Yes/No]")
        C_input = Check_isEmpty(chatbot + ": Do you mean "+ str(sw) +" ?[Yes/No]", input("Customer: "))
        write_to_text.write("Customer: " + C_input + " \n ")
        if(C_input.lower()=="n" or C_input.lower()=="no"):
            return ""
    except IndexError:
        sw=""
    return str(sw)

# Making Time stemped File name
dateTimeObj = datetime.now()
timestampStr = dateTimeObj.strftime("%d-%b-%Y_(%H-%M-%S)")
write_to_text=open("CH_"+timestampStr+".txt","w+")
write_to_text.write("Time: "+ timestampStr + " \n ")

# Keywords
Feelings=['anxious', 'worried', 'confused', 'helpless', 'hopeless', 'guilty', 'overwhelmed', 'disoriented', 'isolated']
Need_help=['shelter', 'electricity', 'water', 'food', 'hygiene products', 'medical assistance', 'emergency', 'educational resources', 'pet']
Players=['survivors', 'friends', 'loved ones', 'first responders', 'recovery workers', 'community members']
Natural_Disaster=['tornadoes', 'hurricanes', 'severe/tropical storms', 'floods', 'wildfire', 'earthquake', 'drought', 'infectious disease outbreak']
Human_Caused_Disaster=['industrial accidents', 'shootings', 'act of terrorism', 'mass violence', 'community unrest']
Response_dept=['police', 'ambulance', 'fire brigade', 'paramedics', 'disaster recovery unit', 'health assistance']

'''
#Check if the Input is Integer or not
def Ask_Question(Question, C_input):
    while (True):
        try:
            val = int(C_input)
            break
        except ValueError:
            write_to_text.write(Question + " \n ")
            print(Question)
            C_input = input("Customer: ")
            write_to_text.write("Customer: "+ C_input + " \n ")
            continue
    return val
'''

#if the input is empty ask question again
def Check_isEmpty(Question, C_input):
    while (True):
        if(C_input==""):
            print(Question)
            C_input = input("Customer: ")
        else:
            break
    return C_input

# List of common issues/needs present during emergencies
def Issue(C_input):
    while (True):
        if("shelter" in C_input.lower() or "electricity" in C_input.lower()):
            write_to_text.write(chatbot + ": Here's a list of locations with reliable shelter: "+ " \n ")
            print("Here's a list of locations with reliable shelter: ")
            # add resources
            break

        elif("water" in C_input.lower() or "purified water" in C_input.lower()):
            write_to_text.write(chatbot + ": Here's a list of locations with purified water: "+ " \n ")
            print("Here's a list of locations with purified water: ")
            # add resources
            break

        elif("food" in C_input.lower() or "canned goods" in C_input.lower()):
            write_to_text.write(chatbot + ": Here's a list of locations with canned goods: "+ " \n ")
            print("Here's a list of locations with canned goods: ")
            # add resources
            break

        elif("hygiene products" in C_input.lower() or "hygiene" in C_input.lower() or "sanitation facility" in C_input.lower()):
            write_to_text.write(chatbot + ": Here's the location of sanitation facilities: "+ " \n ")
            print("Here's the location of sanitation facilities: ")
            # add resources
            break

        elif("educational resources" in C_input.lower() or "first aid training" in C_input.lower() or "education" in C_input.lower()):
            write_to_text.write(chatbot + ": Here's some First Aid training locations: "+ " \n ")
            print("Here's some First Aid training locations: ")
            write_to_text.write(chatbot + ": Here's the government guidelines for preparedness supplies: "+ " \n ")
            print("Here's the government guidelines for preparedness supplies: ")
            # add resources
            break

        elif("pet" in C_input.lower() or "dog" in C_input.lower() or "cat" in C_input.lower()):
            write_to_text.write(chatbot + ": Do you have a pet?[Y/N] "+ " \n ")
            print("Do you have a pet?[Y/N] ")
            C_input =Check_isEmpty(chatbot + ": Do you have a pet?[Y/N] ", input("Customer: "))
            write_to_text.write("Customer: " + C_input + " \n ")
            write_to_text.write(chatbot + ": Here's some resources: "+ " \n ")
            print("Here's some resources: ")
            # add resources
            break

        if(Response_dept):
            write_to_text.write(chatbot + ": Redirecting to relevant emergency response department: "+ " \n ")
            print("Redirecting to relevant emergency response department: ")
            # be careful
            break

        elif(Feelings):
            message = [
                "\nAre you safe?[Y/N] \n",
                "\nAre you able to sleep?[Y/N] \n",
                "\nAre you ok?[Y/N] \n"]
            write_to_text.write(chatbot + ": " f"{random.choice(message)}"+ " \n ")
            print(f"{random.choice(message)}")
            C_input =Check_isEmpty(chatbot + ": " f"{random.choice(message)}", input("Customer: "))
            write_to_text.write("Customer: " + C_input + " \n ")
            write_to_text.write(chatbot + ": Here's some coping tips: "+ " \n ")
            print("Here's some coping tips: ")
            # add resources
            break 

        elif("medical assistance" in C_input.lower() or "emergency" in C_input.lower()):
            write_to_text.write(chatbot + ": What is the location of the emergency? "+ " \n ")
            print("What is the location of the emergency? ")
            C_input =Check_isEmpty(chatbot + ": What is the location of the emergency? ", input("Customer: "))
            write_to_text.write("Customer: " + C_input + " \n ")
            if("don't know" in C_input.lower() or "unsure" in C_input.lower()):
                write_to_text.write(chatbot + ": Any landmarks, parks, businesses nearby? "+ " \n ")
                print("Any landmarks, parks, businesses nearby? ")
                C_input =Check_isEmpty(chatbot + ": Any landmarks, parks, businesses nearby? ", input("Customer: "))
                write_to_text.write("Customer: " + C_input + " \n ")
            
            write_to_text.write(chatbot + ": Please provide a reliable phone number. "+ " \n ")
            print("Please provide a reliable phone number. ")
            C_input =Check_isEmpty(chatbot + ": Please provide a reliable phone number. ", input("Customer: "))
            write_to_text.write("Customer: " + C_input + " \n ")

            write_to_text.write(chatbot + ": What’s the problem? "+ " \n ")
            print("What’s the problem? ")
            C_input =Check_isEmpty(chatbot + ": What’s the problem? ", input("Customer: "))
            write_to_text.write("Customer: " + C_input + " \n ")
            if(Natural_Disaster or Human_Caused_Disaster):
                write_to_text.write(chatbot + ": The emergency response is on the way.")
                print("The emergency response is on the way.")

            write_to_text.write(chatbot + ": Are there other people involved? "+ " \n ")
            print("Are there other people involved? ")
            C_input =Check_isEmpty(chatbot + ": Are there other people involved? ", input("Customer: "))
            write_to_text.write("Customer: " + C_input + " \n ")

            write_to_text.write(chatbot + ": What kind of clothes are YOU wearing? "+ " \n ")
            print("What kind of clothes are YOU wearing? ")
            C_input =Check_isEmpty(chatbot + ": What kind of clothes are YOU wearing? ", input("Customer: "))
            write_to_text.write("Customer: " + C_input + " \n ")

            write_to_text.write(chatbot + ": Are you inside or outside? "+ " \n ")
            print("Are you inside or outside? ")
            C_input =Check_isEmpty(chatbot + ": Are you inside or outside? ", input("Customer: "))
            write_to_text.write("Customer: " + C_input + " \n ")
            break

        else:
            write_to_text.write(chatbot + ": Sorry! Invalid input."+ " \n ")
            print("Sorry! Invalid input.")
            break
    
# Start of Program
write_to_text.write(chatbot + ": Hi! I'm Ávila. I'm here to assist you during natural disasters." + " \n ")
print("\nHi! I'm Ávila. I'm here to assist you during natural disasters.\n")
write_to_text.write(chatbot + ": What's your full name? " + " \n ")
print("What's your full name? ") 
name = Check_isEmpty(chatbot + ": What's your full name? ", input("Customer: ")) 
write_to_text.write("Customer: " + name + " \n ")

write_to_text.write(chatbot + ": Hi, " + name + ". How can I help you today? " + " \n ")
print("Hi, " + name + ". How can I help you today?")
C_input = Check_isEmpty(chatbot + ": Hi, " + name + ". How can I help you today? ", input("Customer: "))
write_to_text.write("Customer: " + C_input + " \n ")
Issue(C_input)

# End
write_to_text.write(chatbot + ": Is there anything else I can assist you with?[Y/N] "+ " \n ")
print("Is there anything else I can assist you with?[Y/N] ")
C_input =Check_isEmpty(chatbot + ": Is there anything else I can assist you with?[Y/N] ", input("Customer: "))
write_to_text.write("Customer: " + C_input + " \n ")
if("n" in C_input.lower() or "no" in C_input.lower()):
    write_to_text.write(chatbot + ": Glad I could help. Take care and stay safe ❤️")
    print("Glad I could help. Take care and stay safe ❤️")
    write_to_text.close()
    sys.exit()
elif("y" in C_input.lower() or "yes" in C_input.lower()):
    write_to_text.write(chatbot + ": What else can I assist you with? "+ " \n ")
    print("What else can I assist you with? ")
    C_input =Check_isEmpty(chatbot + ": What else can I assist you with? ", input("Customer: "))
    write_to_text.write("Customer: " + C_input + " \n ")
    Issue(C_input)
