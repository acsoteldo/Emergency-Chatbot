import sys
from datetime import datetime
from difflib import get_close_matches
import random

# Closest word match function
def closeMatches(word,patterns):
    #if(any(word.lower() in s.lower() for s in patterns)):
    for p in patterns:
        if(p.lower()== word.lower()):
           return p
    try:
        sw=get_close_matches(word, patterns, n=1)[0]
        write_to_text.write("Chatbot: Do you mean "+ str(sw) +" ?[Yes/No]" + " \n ")
        print("Chatbot: Do you mean "+ str(sw) +" ?[Yes/No]")
        C_input = Check_isEmpty("Chatbot: Do you mean "+ str(sw) +" ?[Yes/No]", input("Customer: "))
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

#if the input is empty ask question again
def Check_isEmpty(Question, C_input):
    while (True):
        if(C_input==""):
            print(Question)
            C_input = input("Customer: ")
        else:
            break
    return C_input

# Start of Program
def chatbot():
    write_to_text.write("Hi! I'm Ávila. I'm here to assist you during natural disasters." + " \n ")
    print("\nHi! I'm Ávila. I'm here to assist you during natural disasters.\n")
    write_to_text.write("What's your full name? " + " \n ")
    print("What's your full name? ") 
    name = Check_isEmpty("What's your full name? ", input("Customer: ")) 
    write_to_text.write("Customer: " + name + " \n ")

    write_to_text.write("Hi, " + name + ". How can I help you today? " + " \n ")
    print(f"Hi, " + name + ". How can I help you today?")
    C_input = Check_isEmpty("Hi, " + name + ". How can I help you today? ", input("Customer: "))
    write_to_text.write("Customer: " + C_input + " \n ")

    if("shelter" in C_input.lower() or "electricity" in C_input.lower()):
        write_to_text.write("Here's a list of locations with reliable shelter: "+ " \n ")
        print("Here's a list of locations with reliable shelter: ")
        # add resources

    elif("water" in C_input.lower() or "purified water" in C_input.lower()):
        write_to_text.write("Here's a list of locations with purified water: "+ " \n ")
        print("Here's a list of locations with purified water: ")
        # add resources

    elif("food" in C_input.lower() or "canned goods" in C_input.lower()):
        write_to_text.write("Here's a list of locations with canned goods: "+ " \n ")
        print("Here's a list of locations with canned goods: ")
        # add resources

    elif("hygiene products" in C_input.lower() or "hygiene" in C_input.lower() or "sanitation facility" in C_input.lower()):
        write_to_text.write("Here's the location of sanitation facilities: "+ " \n ")
        print("Here's the location of sanitation facilities: ")
        # add resources

    elif("educational resources" in C_input.lower() or "first aid training" in C_input.lower() or "education" in C_input.lower()):
        write_to_text.write("Here's some First Aid training locations: "+ " \n ")
        print("Here's some First Aid training locations: ")
        write_to_text.write("Here's the government guidelines for preparedness supplies: "+ " \n ")
        print("Here's the government guidelines for preparedness supplies: ")
        # add resources

    elif("pet" in C_input.lower() or "dog" in C_input.lower() or "cat" in C_input.lower()):
        write_to_text.write("Do you have a pet?[Y/N] "+ " \n ")
        print("Do you have a pet?[Y/N] ")
        C_input =Check_isEmpty("Do you have a pet?[Y/N] ", input("Customer: "))
        write_to_text.write("Customer: " + C_input + " \n ")
        write_to_text.write("Here's some resources: "+ " \n ")
        print("Here's some resources: ")
        # add resources
    '''
    if(Response_dept):
        write_to_text.write("Redirecting to relevant emergency response department: "+ " \n ")
        print("Redirecting to relevant emergency response department: ")
        # be careful
        continue

    elif(Feelings):
        message = [
            "\nAre you safe?[Y/N] \n",
            "\nAre you able to sleep?[Y/N] \n",
            "\nAre you ok?[Y/N] \n"]
        write_to_text.write(f"{random.choice(message)}"+ " \n ")
        print(f"{random.choice(message)}")
        C_input =Check_isEmpty(f"{random.choice(message)}", input("Customer: "))
        write_to_text.write("Customer: " + C_input + " \n ")
        write_to_text.write("Here's some coping tips: "+ " \n ")
        print("Here's some coping tips: ")
        # add resources
        write_to_text.close() '''

    if("medical assistance" in C_input.lower() or "emergency" in C_input.lower()):
        write_to_text.write("What is the location of the emergency? "+ " \n ")
        print("What is the location of the emergency? ")
        C_input =Check_isEmpty("What is the location of the emergency? ", input("Customer: "))
        write_to_text.write("Customer: " + C_input + " \n ")
        if("don't know" in C_input.lower() or "unsure" in C_input.lower()):
            write_to_text.write("Any landmarks, parks, businesses nearby? "+ " \n ")
            print("Any landmarks, parks, businesses nearby? ")
            C_input =Check_isEmpty("Any landmarks, parks, businesses nearby? ", input("Customer: "))
            write_to_text.write("Customer: " + C_input + " \n ")
        
        write_to_text.write("Please provide a reliable phone number. "+ " \n ")
        print("Please provide a reliable phone number. ")
        C_input =Check_isEmpty("Please provide a reliable phone number. ", input("Customer: "))
        write_to_text.write("Customer: " + C_input + " \n ")

        write_to_text.write("What’s the problem? "+ " \n ")
        print("What’s the problem? ")
        C_input =Check_isEmpty("What’s the problem? ", input("Customer: "))
        write_to_text.write("Customer: " + C_input + " \n ")
        if(Natural_Disaster or Human_Caused_Disaster):
            print("The emergency response is on the way.")
            write_to_text.write("The emergency response is on the way.")

        write_to_text.write("Are there other people involved? "+ " \n ")
        print("Are there other people involved? ")
        C_input =Check_isEmpty("Are there other people involved? ", input("Customer: "))
        write_to_text.write("Customer: " + C_input + " \n ")

        write_to_text.write("What kind of clothes are YOU wearing? "+ " \n ")
        print("What kind of clothes are YOU wearing? ")
        C_input =Check_isEmpty("What kind of clothes are YOU wearing? ", input("Customer: "))
        write_to_text.write("Customer: " + C_input + " \n ")

        write_to_text.write("Are you inside or outside? "+ " \n ")
        print("Are you inside or outside? ")
        C_input =Check_isEmpty("Are you inside or outside? ", input("Customer: "))
        write_to_text.write("Customer: " + C_input + " \n ")
    
    else:
        write_to_text.write("Sorry! Invalid input"+ " \n ")
        print("Sorry! Invalid input")

write_to_text.write("Is there anything else I can assist you with?[Y/N] "+ " \n ")
print("Is there anything else I can assist you with?[Y/N] ")
C_input =Check_isEmpty("Is there anything else I can assist you with?[Y/N] ", input("Customer: "))
write_to_text.write("Customer: " + C_input + " \n ")
if("n" in C_input.lower() or "no" in C_input.lower()):
    print("Glad I could help. \nTake care and stay safe ❤️")
    write_to_text.write("Glad I could help. \nTake care and stay safe ❤️")
    write_to_text.close()
    sys.exit()
else:
    chatbot()
    # elif("y" in C_input.lower() or "yes" in C_input.lower()): loop
