Load Test API
--------------

Run both project seperately in given ports below

Install pip packages using below command:-
------------------------------------------

pip install -r requirement.txt

trickle_api Project command:-
------------------------------

python manage.py runserver 0:8082

trickle_api_2 Project command:-
--------------------------------

python manage.py runserver 0:8080

Install hey using below command:-
----------------------------------

sudo apt install hey

Sample command to run call hey:-
--------------------------------

hey -c 250 -z 5m -d '{}' -m POST http://localhost:8082/app2/ser5
